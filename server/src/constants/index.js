export const CURRENT_MODEL_VERSION = 'v2';
export const MODEL_LATENCY_MS = 400;

export const CORE_FIELDS = ['amount','description', 'glNumber', 'postingDate'];

export const METADATA_FIELDS = ['comments', 'workflowStatus'];

export const JOB_TYPE = Object.freeze({
    FULL_ENRICHMENT: 'FULL_ENRICHMENT',
});

export const JOB_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
});

export const ENRICHMENT_STATUS = Object.freeze({
    PENDING: 'pending',
    PROCESSING: 'processing',
    COMPLETE: 'complete',
    FAILED: 'failed',
    STALE: 'stale',
});

export const SEVERITY = Object.freeze({
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
});

export const SEARCH_STRATEGY = Object.freeze({
    SEMANTIC: 'semantic',
    FINANCIAL: 'financial',
    ENTITY: 'entity',
});

export const VECTOR_DIMENSIONS = 16;