import { SEVERITY } from "../constants/index.js";

export class RiskScoringService {

    tier(score){
        if(score >= 0.7) return SEVERITY.HIGH;
        if(score >= 0.4) return SEVERITY.MEDIUM;
        return SEVERITY.LOW;
    }
    
    score(entry){
        const factors = [];

        if(Number(entry.debit) !== Number(entry.credit)){
            factors.push({ code: 'unbalanced', weight: 0.5, detail: 'Debit does not equal credit' });
        }

        const posted = new Date(entry.postingDate);
        const hour = posted.getUTCHours();
        const day = posted.getUTCDay();
        const oddHour = hour < 6;
        const weekend = day === 0 || day === 6;

        if(oddHour || weekend){
            factors.push({
                code: 'off_hours',
                weight: 0.25,
                detail: `Posted at an unusual time ${posted.toUTCString()}`
            });
        }

        if(Number(entry.amount) >= 100000 && Number(entry.amount) % 10000 === 0){
            factors.push({ code: 'round_amount', weight: 0.15, detail: 'Large, perfectly-round amount' });
        }

        if(!entry.description || entry.description.trim().length < 0){
            factors.push({ code: 'thin_description', weight: 0.1, detail: 'Description is missing or too short' });
        }

        const riskScore = Math.min(1, Number(factors.reduce((sum, f) => sum + f.weight, 0).toFixed(3)));
        return {riskScore, severity: this.tier(riskScore), factors};
    }
}