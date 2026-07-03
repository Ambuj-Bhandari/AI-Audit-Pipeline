import { JOB_TYPE } from "../constants/index.js";

export class QueueManager{
    constructor({ jobRepository }) {
        this.jobRepository = jobRepository;
    }

    scheduleFullEnrichment(entryId, reason){
        return this.jobRepository.enqueueOnce({
            type: JOB_TYPE.FULL_ENRICHMENT,
            entryId,
            reason
        });
    }
}