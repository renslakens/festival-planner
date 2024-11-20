import { IEnvironment } from "./environment.interface";

export const environment: IEnvironment = {
    production: true,
    ROOT_DOMAIN_URL: "https://festival-planner.azurewebsites.net",
    dataApiUrl: "https://festival-planner.azurewebsites.net/api",
    MONGO_DB_CONNECTION_STRING: "mongodb://localhost:27017/festival-planner"
};