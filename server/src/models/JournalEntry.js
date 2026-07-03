import mongoose from 'mongoose';
import { ENRICHMENT_STATUS, SEVERITY } from '../constants/index.js';

const { Schema } = mongoose;

const AnomalySignalSchema = new Schema(
    {
        type: { type: String, required: true },
        field: { type: String, required: true },
        detail: { type: String, required: true },
        severity: { type: String, enum: Object.values(SEVERITY), required: true },
    },
    {
        _id: false
    }
);

const VectorSpacesSchema = new Schema(
    {
        semantic: { type: [Number], default:[] },
        financial: { type: [Number], default:[] },
        entity: { type: [Number], default:[] },
    },
    {
        _id: false
    }
);

const ComplianceSchema = new Schema(
    {
        ifrsPass: { type: Boolean , default: true },
        flags: { type: [String], default:[] },
    },
    {
        _id: false
    }
);

const IntelligenceSchema = new Schema(
    {
        status: { 
            type: [Number], 
            enum: Object.values(ENRICHMENT_STATUS),
            default: ENRICHMENT_STATUS.PENDING,
        },
        modelVersion: { type: String , default: null},
        riskScore: { type: Number, default: null },
        severity: { type: String , enum: [...Object.values(SEVERITY),null], default: null },
        anomalies: { type: [AnomalySignalSchema], default: [] },
        vectors: { type: VectorSpacesSchema, default: () => ({}) },
        compliance: { type: ComplianceSchema, default: () => ({})  },
        computedAt: { type: Date, default: null },
        error: { type: String, default: null },
    },
    {
        _id: false
    }
);

const MetaDataSchema = new Schema(
    {
        comments: { type: [String] , default: [] },
        workflowStatus: { type: String, default: 'open' },
    },
    {
        _id: false
    }
);

const JournalEntrySchema = new Schema(
    {
        postingDate: { type: Date, required: true },
        transactionType: { type: String, required: 'Journal Entry' },
        entryNo: { type: String, required: true , index: true },
        name: { type: String, required: true },
        description: { type: String, default: '' },
        amount: { type: Number, required: true },
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
        currency: { type: String, default: 'INR' },
        glNumber: { type: String, required: true, index: true },
        postingBy: { type: String, default: '' },
        compantId: { type: Schema.Types.ObjectId , default: null },
        userId: { type: Schema.Types.ObjectId, default: null },
        sourceId: { type: String, default: '' },
        uploadId: { type: String, default: '' },
        systemCreated: { type: Boolean, default: false },
        uploadSourceType: { type: Number, default: 1 },
        intelligence: { type: IntelligenceSchema, default: ()=>({}) },
        metadata: { type: MetaDataSchema, default: ()=>({}) },
    },
    {
        timestamps: { createdAt: 'created', updatedAt: 'updated' }
    }
);

export const JournalEntry = mongoose.model('JournalEntry', JournalEntrySchema);


