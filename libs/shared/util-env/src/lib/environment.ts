import { IEnvironment } from "./environment.interface";

export const commonEnvironment: IEnvironment = {
    production: false,
    apiUrl: 'https://festival-planner-5vf5.onrender.com/',
    MONGO_URI: 'mongodb://localhost:27017/festival-planner'
};