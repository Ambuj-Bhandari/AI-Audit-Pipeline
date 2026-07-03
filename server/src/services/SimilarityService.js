import { cosineSimilarity } from "../utils/vector.js";
import { SEARCH_STRATEGY } from "../constants/index.js";

export class SimilarityService {
    constructor({ entryRepository }) {
        this.entryRepository = entryRepository;
    }

    async findSimilar(entryId, strategy, topN = 5) {
        if( !Object.values(SEARCH_STRATEGY).includes(strategy) ){
            throw Object.assign(new Error(`Unknown Search Strategy "${strategy}"`), { status: 400 });
        }

        const query = await this.entryRepository.findById(entryId);
        if(!query) throw Object.assign(new Error("Entry Not Found"), { status: 400 });

        const queryVector = query.intelligence?.vectors?.[strategy];
        if(!queryVector || !queryVector.length){
            throw Object.assign(new Error("Query entry has no vectors yet"), { status: 400 });
        }

        const candidates = await this.entryRepository.findEnrichedExcept(entryId);

        return candidates.map( (candidate)=>({
            entryId: candidate._id,
            entryNo: candidate.entryNo,
            name: candidate.name,
            amount: candidate.amount,
            severity: candidate.intelligence.severity,
            score: cosineSimilarity(queryVector, candidate.intelligence?.vectors?.[strategy] || []),
        }) )
        .sort((a,b)=> b.score - a.score )
        .slice(0,topN);
    }
}