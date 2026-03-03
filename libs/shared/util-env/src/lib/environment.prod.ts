import { IEnvironment } from "./environment.interface";

export const commonEnvironmentProd: IEnvironment = {
    production: true,
    apiUrl: 'https://festival-planner-5vf5.onrender.com/',
    MONGO_URI: 'mongodb+srv://rens:l7hS2Kngar9X8WIX@festival-planner.hfz1dbx.mongodb.net/?appName=festival-planner'
};