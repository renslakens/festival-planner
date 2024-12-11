import { Id } from './id.type';

export interface IPerformance {
    _id: Id;
    dateTime: Date;
    period: number;
    specialFeatures: string;
    description: string;
    stageId: Id;
    artistId: Id;
}

export type ICreatePerformance = Pick<
    IPerformance,
    'dateTime' | 'period' | 'specialFeatures' | 'description' | 'stageId' | 'artistId'
>;
export type IUpdatePerformance = Partial<Omit<IPerformance, 'id'>>;

// export interface IPerformanceResponse {
//     results: IPerformance;
// }