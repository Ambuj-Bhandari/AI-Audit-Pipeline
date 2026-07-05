import { EntryRepository } from './repository/EntryRepository.js';
import { JobRepository } from './repository/JobRepository.js';
import { RiskScoringService } from './services/RiskScoringService.js';
import { AnomalyDetectionService } from './services/AnomalyDetectionService.js';
import { VectorService } from './services/VectorService.js';
import { EntryService } from './services/EntryService.js';
import { EnrichmentService } from './services/EnrichmentService.js';
import { SimilarityService } from './services/SimilarityService.js';
import { QueueManager } from './queue/QueueManager.js';
import { Worker } from './queue/Worker.js';
import { EntryController } from './controllers/EntryController.js';
import { EntryRouter } from './routes/EntryRouter.js';

export function buildContainer() {
    const entryRepository = new EntryRepository();
    const jobRepository = new JobRepository();

    const enrichmentService = new EnrichmentService({
        riskService: new RiskScoringService(),
        anomalyService: new AnomalyDetectionService(),
        vectorService: new VectorService(),
    });

    const similarityService = new SimilarityService({ entryRepository });
    const queueManager = new QueueManager({ jobRepository });
    const entryService = new EntryService({
        entryRepository, queueManager, enrichmentService, similarityService
    });

    const entryController = new EntryController({ entryService });
    const entryRouter = new EntryRouter({ entryController });
    const worker = new Worker({ jobRepository, entryRepository, enrichmentService });

    return {
        entryRepository,
        jobRepository,
        enrichmentService,
        similarityService,
        queueManager,
        entryService,
        entryController,
        entryRouter,
        worker
    };

}