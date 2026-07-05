import { MODEL_LATENCY_MS, CURRENT_MODEL_VERSION, ENRICHMENT_STATUS } from "../constants/index.js";

const sleep = (ms)=> new Promise((resolve) => setTimeout(resolve,ms));

export class EnrichmentService{
    constructor({ riskService, anomalyService, vectorService }){
        this.riskService = riskService;
        this.anomalyService = anomalyService;
        this.vectorService = vectorService;
    }

    async runFull(entry){
        await sleep(MODEL_LATENCY_MS);

        const {riskScore, severity} = this.riskService.score(entry);
        const anomalies = this.anomalyService.detect(entry);
        const vectors = this.vectorService.buildVectors(entry);
        const compliance = this.vectorService.evaluateCompliance(entry);

        return {
            status: ENRICHMENT_STATUS.COMPLETE,
            modelVersion: CURRENT_MODEL_VERSION,
            riskScore,
            severity,
            anomalies,
            vectors,
            compliance,
            computedAt: new Date(),
            error: null
        };
    }

    runRiskOnly(entry){
        const {riskScore, severity} = this.riskService.score(entry);
        const anomalies = this.anomalyService.detect(entry);
        const compliance = this.vectorService.evaluateCompliance(entry);

        return { riskScore, severity, anomalies, compliance, computedAt: new Date()};
    }
}