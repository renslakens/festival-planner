import { Id } from './id.type';

export interface IFestival {
    id: Id;
    name: string;
    description: string;
    date: Date;
    location: string;
    is18Plus: boolean;
}

export type ICreateFestival = Pick<
    IFestival,
    'name' | 'description' | 'date' | 'location' | 'is18Plus'
>;
export type IUpdateFestival = Partial<Omit<IFestival, 'id'>>;