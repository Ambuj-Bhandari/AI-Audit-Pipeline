import { database } from '../src/config/db.js';
import { EntryRepository } from '../src/repository/EntryRepository.js';
import { EnrichmentService } from '../src/services/EnrichmentService.js';

const BATCH_SIZE = Number(process.env.MIGRATE_BATCH_SIZE) || 100;

async function run() {
    await database.connect();

    const repo = new EntryRepository();
    const enrichment = new EnrichmentService();

    let afterId = null;
    let updated = 0;

    while(true){
        const batch = await repo.pageAll(afterId, BATCH_SIZE);
        if(batch.length === 0) break;

        for(const entry of batch){
            const partial = await enrichment.runRiskOnly(entry);

            await repo.setRiskAndCompliance(entry._id, partial);
            updated+=1;
        }
        afterId = batch[batch.length - 1]._id;
        if(batch.length < BATCH_SIZE) break;
    }

    console.log(`[re-eval] complete -- re-computed Risk/Compliance for ${updated} record(s) (vectors untouched)`);
    await database.disconnect();

}

run().catch((err)=>{
    console.error("[migrate] Fatal: ", err);
    process.exit(1);
});