import { database } from './config/db.js';
import { config } from './config/env.js';
import { buildContainer } from './container.js';
import { App } from './app.js';

import dns from 'node:dns';
dns.setServers(['1.1.1.1', '8.8.8.8']);


async function main() {
    await database.connect();
    const { entryRouter } = buildContainer();
    const app = new App({ entryRouter });

    app.instance.listen(config.port, ()=>{
        console.log(`[api] listening on port ${config.port}`);
    });
    
}

main().catch((err)=>{
    console.error('[api] fatal: ',err);
    process.exit(1);
});