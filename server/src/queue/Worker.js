import { config } from '../config/env.js';
import { ENRICHMENT_STATUS } from '../constants/index.js';

export class Worker{
    constructor({ jobRepository, entryRepository, enrichmentService }){
        this.jobRepository = jobRepository;
        this.entryRepository = entryRepository;
        this.enrichmentService = enrichmentService;
        this.running = false;
        this.timer = null;
    }

    start(){
        this.running = true;
        console.log(`worker started --- polling every ${config.workerPollInterval} ms`);
        this.loop();
    }

    stop(){
        this.running = false;
        if (this.timer) clearTimeout(this.timer);
    }

    async loop(){
        if(!this.running) return;

        try{
            let processed = 0;
            while (this.running && (await this.tick())) processed+=1;
            if(processed > 0){
                console.log(`worker idle --- processed ${processed} jobs, waiting for more`);
            }
        }catch(err){
            console.error('worker loop error: ', err);
        }
        this.timer = setTimeout(() => this.loop(), config.workerPollInterval);
    }

    async tick(){
        const job = await this.jobRepository.claimNext();
        if (!job) return false;

        console.log(`worker claimed job ${job._id} (${job.type}) for entry ${job.entryId} -- reason: ${job.reason}`);

        try{
            const entry = await this.entryRepository.findById(job.entryId);
            if(!entry) throw new Error('Entry no longer exists');

            await this.entryRepository.markIntelligenceStatus(job.entryId, ENRICHMENT_STATUS.PROCESSING);
            const intelligence = await this.enrichmentService.runFull(entry);
            await this.entryRepository.setIntelligence(job.entryId, intelligence);
            await this.jobRepository.complete(job._id);

            console.log(`worker done job ${job._id} -- risk=${intelligence.riskScore} severity=${intelligence.severity} anomalies=${intelligence.anomalies.length}`);

        }catch(err){
            await this.jobRepository.fail(job._id, err.message);
            await this.entryRepository.markIntelligenceStatus(job.entryId, ENRICHMENT_STATUS.FAILED);

            console.error(`worker FAILED job ${job._id}: `, err.message);
        }
        return true;
    }
}