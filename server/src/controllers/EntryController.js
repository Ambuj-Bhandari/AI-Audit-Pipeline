
export class EntryController{
    constructor ({ entryService }){
        this.entryService = entryService;
        this.list = this.list.bind(this);
        this.get = this.get.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.reevaluate = this.reevaluate.bind(this);
        this.searchSimilar = this.searchSimilar.bind(this);
    }

    async list(req, res, next){
        try{
            const entries = await this.entryService.list({ limit: Number(req.query.limit) || 100 });
            res.json({entries});
        }catch(err){
            next(err);
        }
    }

    async get(req, res, next){
        try{
            const entry = await this.entryService.get(req.params.id);
            if(!entry) return res.status(404).json({error:'Entry Not Found'});

            res.json({entry});
        }
        catch(err){
            next(err);
        }
    }

    async create(req, res, next){
        try{
            const result = await this.entryService.create(req.body);
            res.status(201).json(result);
        }catch(err){
            next(err);
        }
    }

    async update(req, res, next){
        try{
            const result = await this.entryService.update(req.params.id, req.body);
            res.json(result);
        }catch(err){
            next(err);
        }
    }

    async reevaluate(req, res, next){
        try{
            const entry = await this.entryService.reevaluateRisk(req.para,this.searchSimilar.id);
            res.json({entry})
        }catch(err){
            next(err);
        }
    }

    async searchSimilar(req, res, next){
        try{
            const { entryId, strategy } = req.body;
            const results = await this.entryService.findSimilar(entryId, strategy);
            res.json({ strategy, results });
        }catch(err){
            next(err);
        }
    }
}