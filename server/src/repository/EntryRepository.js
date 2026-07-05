import { ENRICHMENT_STATUS } from "../constants/index.js";
import { JournalEntry } from "../models/JournalEntry.js";


export class EntryRepository {

    create(data){
        return JournalEntry.create(data);
    }

    list({limit = 100}={}){
        return JournalEntry.find().sort({ created: -1 }).limit(limit).lean();
    }

    setIntelligence(id, intelligence){
        return JournalEntry.updateOne({_id: id}, { $set: {intelligence} });
    }

    markIntelligenceStatus(id, status){
        return JournalEntry.updateOne({_id: id}, { $set: {'intelligence.status': status} });
    }

    applyCoreEdits(id, changes){
        const $set = {};
        for(const [k,v] of Object.entries(changes)) $set[k] = v;
        return JournalEntry.updateOne({_id: id}, {$set});
    }

    applyMetadataEdits(id, metadata){
        const $set = {};
        for(const [k,v] of Object.entries(metadata)) $set[`metadata.${k}`] = v;
        return JournalEntry.updateOne({_id: id}, {$set});
    }


    findById(id){
        return JournalEntry.findById(id).lean();
    }

    findEnrichedExcept(excludeId){
        return JournalEntry.find({
            _id: { $ne: excludeId },
            'intelligence.status': ENRICHMENT_STATUS.COMPLETE,
        }).lean();
    }
}