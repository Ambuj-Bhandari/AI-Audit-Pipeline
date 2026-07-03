import { SEVERITY } from "../constants/index.js";

const SUSPICIOUS_TERMS = ['misc', 'adjustment', 'reversal', 'correction', 'test', 'temp', 'urgent'];

export class AnomalyDetectionService {

    detect(entry){
        const signals = [];

        if(Number(entry.amount) >= 100000){
            signals.push({
                type: "numeric_outlier",
                field: "amount",
                details: `Amount ${entry.amount} exceeds the expected transaction ceiling`,
                severity: SEVERITY.HIGH
            });
        }

        if (Number(entry.debit) !== Number(entry.credit)){
            signals.push({
                type: "balance_anomaly",
                field: "debit",
                details: `Debit ${entry.debit} does not match Credit ${entry.credit}`,
                severity: SEVERITY.HIGH
            });
        }

        const desc = (entry.description || '').toLowerCase();
        const hit = SUSPICIOUS_TERMS.find((term) => desc.includes(term));
        if(hit){
            signals.push({
                type: "semantic_anomaly",
                field: "description",
                details: `Description contains uncharacterstics terms "${hit}`,
                severity: SEVERITY.MEDIUM
            });
        }

        const posted = new Date(entry.postingDate);
        if(posted.getUTCHours() < 6){
            signals.push({
                type: "temporal_anomaly",
                field: "postingDate",
                details: `Posted during off-hours (${posted.getUTCHours}:00 UTC)`,
                severity: SEVERITY.MEDIUM
            });
        }

        return signals;
    }
}