import buildVectorSpaces from '../utils/vector.js';
import { EntryService } from './EntryService.js';

export class VectorService {
    constructor( entry ){
        return buildVectorSpaces(entry);
    }

    evaluateCompliance(entry){
        const flags = [];
        if(Number(entry.debit) !== Number(entry.credit)) flags.push("IFRS_UNBALANCED_ENTRY");
        if(!entry.currency) flags.push("IFRS_MISSING_CURRENCY");

        if(!(/^\d{6}$/.test(String(entry.glNumber || '')))) flags.push("IFRS_INVALID_GL_FORMAT");
        if(Number(entry.amount) < 0) flags.push("IFRS_NEGATIVE_AMOUNT");

        return { ifrsPass: flags.length === 0 , flags};
    }
}