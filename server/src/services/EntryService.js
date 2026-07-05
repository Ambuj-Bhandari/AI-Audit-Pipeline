import { CORE_FIELDS, METADATA_FIELDS, ENRICHMENT_STATUS } from "../constants/index.js";

export class EntryService {
    constructor( { entryRepository, queueManager, enrichmentService, similarityService }){
        this.entryRepository = entryRepository;
        this.queueManager = queueManager;
        this.enrichmentService = enrichmentService;
        this.similarityService = similarityService;
    }

    list(opts){
        return this.entryRepository.list(opts);
    }

    get(id){
        return this.entryRepository.findById(id);
    }

    async create(payload){
        const entry  = await this.entryRepository.create({
            ...payload,
            intelligence: { status: ENRICHMENT_STATUS.PENDING },
        });

        const { deduped } = await this.queueManager.scheduleFullEnrichment(entry._id, 'entry created');
        return { entry: entry.toObject(), queued: !deduped };
    }

    async update(id, changes){
        const current = await this.entryRepository.findById(id);
        if(!current) throw Object.assign(new Error('Entry not found'), { status: 404 });

        const coreChanges = this.pickChanged(current, changes, CORE_FIELDS);
        const metadataChanges = this.pickChanged(current.metadata || {}, changes, METADATA_FIELDS);

        if(Object.keys(coreChanges).length > 0){
            return this.applyCoreEdits(id, coreChanges, metadataChanges);
        }
        if(Object.keys(metadataChanges).length > 0){
            return this.applyMetadataEdits(id, metadataChanges);
        }

        return { entry: current, path: 'No_Change', queued: fasle };
    }

    async applyCoreEdits(id, coreChanges, metadataChanges){
        await this.entryRepository.applyCoreEdits(id, coreChanges);
        if(Object.keys(metadataChanges).length){
            await this.entryRepository.applyMetadataEdits(id, metadataChanges);
        }

        await this.entryRepository.markIntelligenceStatus(id, ENRICHMENT_STATUS.STALE);
        const { deduped } = await this.queueManager.scheduleFullEnrichment(id, 'core field edited');
        const entry = await this.entryRepository.findById(id);
        return { entry, path: 'core_edit', queued: !deduped };
    }

    async applyMetadataEdits(id, metadataChanges){
        await this.entryRepository.applyMetadataEdits(id, metadataChanges);
        const entry = await this.entryRepository.findById(id);
        return { entry, path: 'metdata_edits_only', queued: !deduped };
    }

    async reevaluate(id){
         const entry = await this.entryRepository.findById(id);
         if(!entry) throw Object.assign(new Error('Entry not found'), { status: 404 });

         const partial = this.enrichmentService.runRiskOnly(entry);
         await this.entryRepository.setRiskAndCompliance(id, partial);
         return this.entryRepository.findById(id);
    }

    findSimilar(entryId, strategy){
        return this.similarityService.findSimilar(entryId, strategy);
    }

    equals(a,b){
        if(a instanceof Date) return new Date(a).getTime() === new Date(b).getTime();
        if(Array.isArray(a) || Array.isArray(b)) return JSON.stringify(a) === JSON.stringify(b);
        return a===b;
    }

    pickChanged(source, changes, allowed){
        const out = {};
        for(const field of allowed){
            if(!(field in changes)) continue;

            const next = changes[field];
            const prev = source[field];

            if(!this.equals(prev,next)) out[field]=next;
        }
        return out;
    }
}