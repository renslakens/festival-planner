import { IFestival } from "./festival.interface";

export interface IFestivalListResponse {
    results: IFestival[];
    info: {
        version: string;
        type: string;
        count: number;
    };
}