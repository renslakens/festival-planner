import { IEnvironment } from "./environment.interface";

export const commonEnvironment: IEnvironment = {
    production: false,
    apiUrl: 'http://localhost:3000',
    MONGO_URI: 'mongodb://localhost:27017/festival-planner'
};