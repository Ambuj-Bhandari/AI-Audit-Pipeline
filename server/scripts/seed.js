import mongoose from 'mongoose';
import { database } from '../src/config/db.js';
import { JournalEntry } from '../src/models/JournalEntry.js';
import { EnrichmentJob } from '../src/models/EnrichmentJob.js';
import { EnrichmentService } from '../src/services/EnrichmentService.js';

const compantId = new mongoose.Types.ObjectId();
const userId = new mongoose.Types.ObjectId();

function entry ( overrides ){
    return {
        postingDate: new Date(),
        transactionType: 'JournalEntry',
        name: 'Ambuj Pvt. Ltd.',
        description: 'Purchases of raw materials',
        amount: 125000,
        debit: 125000,
        credit: 0,
        currency: 'INR',
        glNumber: '400120',
        postingBy: 'user_842',
        compantId,
        userId,
        sourceId: 'upload_101',
        uploadId: 'file_624',
        systemCreated: false,
        uploadSourceType: 1,
        ...overrides,
    };

}

const SEED = [
    entry({entryNo: 'JE-100001', debit: 125000, credit:125000}),
    entry({entryNo: 'JE-100002', name: "Zenit Logistics",description:"Freight Charges Q2",amount:48250, debit: 48250, credit:48250, glNumber: '510300'}),
    entry({entryNo: 'JE-100003', description:"misc adjustment",amount:90000, debit: 90000, credit:0}),
    entry({entryNo: 'JE-100004', name: "Northwind Corp",description:"Payroll disbursment",amount:1500000, debit: 1500000, credit:1500000, glNumber: '620100'}),
    entry({entryNo: 'JE-100005', description:"Consulting Fees",amount:300000, debit: 300000, credit:300000, glNumber: '530200',postingDate: new Date()}),
    entry({entryNo: 'JE-100006', name: "Acme Supplies",description:"office stationary",amount:12500, debit: 12500, credit:12500, glNumber: '540110'}),
    entry({entryNo: 'JE-100007', description:"reversal",amount:200000, debit: 200000, credit:190000, glNumber: '400128'}),
    entry({entryNo: 'JE-100008', name: "Global Vex Pvt. Ltd.",description:"Subscription renewal",amount:60000, debit: 60000, credit:60000, glNumber: '550400'}),
    entry({entryNo: 'JE-100009', description:"temp",amount:500000, debit: 500000, credit:500000, glNumber: '400120'}),
    entry({entryNo: 'JE-100010', name: "Initech",description:"Utility Bill Payment",amount:34200, debit: 34200, credit:34200, glNumber: '560300'}),
    entry({entryNo: 'JE-100011', name: "Umbrella Inc.",description:"Equipment Purchase",amount:800000, debit: 800000, credit:0, glNumber: '150100', postingDate: new Date()}),
    entry({entryNo: 'JE-100012', name: "Wayne Tech.",description:"Warehouse Rent",amount:220000, debit: 220000, credit:220000, glNumber: '520100'}),
];

async function run() {
    await database.connect();
    await Promise.all([JournalEntry.deleteMany({}), EnrichmentJob.deleteMany({})]);
    console.log("[seed] cleared collection");

    const enrichment = new EnrichmentService();
    const docs = await JournalEntry.insertMany(SEED);
    console.log(`[seed] inserted ${docs.length} entries - enriching inline....`);

    for(const doc of docs){
        const intelligence = await enrichment.runFull(doc.toObject());

        await JournalEntry.updateOne({_id: doc.id},{ $set: { intelligence }});
        console.log(`[seed] ${doc.entryNo}---> risk ${intelligence.riskScore} ({${intelligence.severity})`);
    }

    console.log("[seed] done..");
    await database.disconnect();
}

run().catch((err) => {
    console.error('[seed] failed: ', err);
    process.exit(1);
});