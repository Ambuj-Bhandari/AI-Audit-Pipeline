import { database } from './config/db.js';
import { buildContainer } from './container.js';

async function main() {

    await database.connect();
    const { worker } = buildContainer();
    worker.start();

    const shutdown = async() => {
        console.log("\n [worker] shutting down...");
        worker.stop();

        await database.disconnect();
        process.exit(0);
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    
}

main().catch((err)=>{
    console.error('[worker] fatal: ', err);
    process.exit(1);
});