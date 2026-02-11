import { IEnvironment } from "./environment.interface";

export const commonEnvironmentProd: IEnvironment = {
    production: true,
    apiUrl: 'https://api.festival-planner.com/api',
    MONGO_URI: 'mongodb://mongo:27017/festival-planner'
};