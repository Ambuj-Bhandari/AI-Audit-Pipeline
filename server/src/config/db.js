import mongoose from 'mongoose';
import { config, assertConfig } from './env.js';

export class DataBase{
    constructor(){
        this.connection = null;
    }

    async connect(){
        assertConfig();
        if (this.connection) return this.connection;

        mongoose.set('strictQuery', true);
        await mongoose.connect(config.mongoURI, {dbName: config.dbName});
        this.connection = mongoose.connection;

        console.log(`db connection to "${config.dbName}`);
        return this.connection;
    }

    async disconnect(){
        await mongoose.disconnect();
        this.connection = null;
    }
}

export const database = new DataBase();