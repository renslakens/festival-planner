import { Id } from './id.type';

export interface IFestival {
    _id: Id;
    name: string;
    description: string;
    date: Date;
    location: string;
    is18Plus: boolean;
    stages: Id[];
}

export type ICreateFestival = Pick<
    IFestival,
    'name' | 'description' | 'date' | 'location' | 'is18Plus' | 'stages'
>;
export type IUpdateFestival = Partial<Omit<IFestival, 'id'>>;

// export interface IFestivalResponse {
//     results: IFestival;
// }