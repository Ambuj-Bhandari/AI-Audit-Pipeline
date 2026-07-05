import { Router } from "express";

export class EntryRouter {
    constructor({ entryController }){
        this.entryController = entryController;
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes(){
        const controller = this.entryController;
        this.router.get('/', controller.list);
        this.router.post('/', controller.create);
        this.router.post('/search/similar', controller.searchSimilar);
        this.router.get('/:id', controller.get);
        this.router.put('/:id', controller.update);
        this.router.post('/:id/reevaluate', controller.reevaluate);

    }

    get instance(){
        return this.router;
    }
}