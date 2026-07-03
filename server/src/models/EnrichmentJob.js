import mongoose from 'mongoose';
import {JOB_STATUS, JOB_TYPE} from '../constants/index.js';


const {Schema} = mongoose;

const EnrichmentJobSchema = new Schema(
    {
        type: { type: String, enum: Object.values(JOB_TYPE), required: true },
        entryId: { type: Schema.Types.ObjectId, ref: 'JournalEntry',required: true },
        status: {
            type: String,
            enum: Object.values(JOB_STATUS),
            default: JOB_STATUS.PENDING,
            index = true,
        },
        attempts: { type: Number, default: 0 },
        reason: { type: String, default: '' },
        claimedAt: { type: Date, default: null },
        finishedAt: { type: Date, default:null },
        error: { type: String, default: null },
    },
    {
        timestamps: true
    }
);

EnrichmentJobSchema.index({ staus: 1, createdAt:1 });

export const EnrichmentJob = mongoose.model('EnrichmentJob', EnrichmentJobSchema);