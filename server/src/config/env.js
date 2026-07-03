import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: Number(process.env.PORT) || 4000,
    mongoURI: process.env.MONGODB_URI,
    dbName: process.env.DB_NAME || 'audit_pipeline',
    workerPollInterval: Number(process.env.WORKER_POLL_INTERVAL_MS) || 1000,
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}

export function assertConfig() {
    if (!config.mongoURI)
        throw new Error("MONGODB_URI is required. Set your Atlas connection string in the environment variables")
}