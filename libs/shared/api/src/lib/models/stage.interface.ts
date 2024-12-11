import { Id } from './id.type';

export interface IStage {
    _id: Id;
    name: string;
    capacity: number;
    covered: boolean;
    festivalId: Id;
}

export type ICreateStage = Pick<
    IStage,
    'name' | 'capacity' | 'covered' | 'festivalId'
>;
export type IUpdateStage = Partial<Omit<IStage, 'id'>>;

// export interface IStageResponse {
//     results: IStage;
// }