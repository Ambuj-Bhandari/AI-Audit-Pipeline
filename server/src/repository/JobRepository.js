import { EnrichmentJob } from "../models/EnrichmentJob.js";
import { JOB_STATUS } from "../constants/index.js";

export class JobRepository {

    async enqueueOnce({ type, entryId, reason }){
        const existing = await EnrichmentJob.findOne({
            entryId,
            status: { $in: [JOB_STATUS.PENDING, JOB_STATUS.PROCESSING] },
        }).lean();

        if(existing) return { job: existing, deduped: true };

        const job = await EnrichmentJob.create({ type, entryId, reason });
        return { job: job.toObject, deduped: false };
    }

    claimNext(){
        return EnrichmentJob.findOneAndUpdate(
            { status: JOB_STATUS.PENDING },
            { $set: { status: JOB_STATUS.PROCESSING, claimedAt: new Date() }, $inc: { attempts: 1 } },
            { sort: { createdAt: 1 }, new: true }
        ).lean();
    }

    complete(jobId){
        return EnrichmentJob.updateOne(
            { _id: jobId },
            { $set: { status: JOB_STATUS.COMPLETE, finishedAt: new Date(), error: null } }
        );
    }

    fail(jobId, error){
        return EnrichmentJob.updateOne(
            { _id: jobId },
            { $set: { status: JOB_STATUS.FAILED, finishedAt: new Date(), error: error } }
        );
    }
}