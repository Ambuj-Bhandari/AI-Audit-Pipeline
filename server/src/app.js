import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';

export class App {
    constructor({entryRouter}){
        this.app = express();
        this.entryRouter = entryRouter;
        this.configure();
    }

    configure(){
        this.app.use(cors({ origin: config.clientOrigin }));
        this.app.use(express.json());

        this.app.get('/health',(_req, res) => res.json({ok: true}));
        this.app.use('/api/entries', this.entryRouter.instance);

        this.app.use((_req, res) => res.status(404).json({error: 'Not Found'}));

        this.app.use((err, _req, res, _next) => {
            console.error(`[api] error: `, err.message);
            res.status(err.status || 500).json({ error: err.message || 'Internal error'});
        });
    }

    get instance(){
        return this.app;
    }
}