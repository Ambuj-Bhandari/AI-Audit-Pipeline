import { ENRICHMENT_STATUS } from "../constants";
import { JournalEntry } from "../models/JournalEntry.js";


export class EntryRepository {
    findById(id){
        return JournalEntry.findById(id).lean();
    }

    findEnrichedExcept(excludeId){
        return JournalEntry.find({
            _id: { $ne: excludeId },
            'intelligence.status': ENRICHMENT_STATUS.COMPLETE,
        }).lean();
    }
}