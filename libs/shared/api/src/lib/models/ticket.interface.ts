import { Id } from './id.type';

export interface ITicket {
    _id: Id;
    name: string;
    purchaseDate?: Date;
    price: number;
    festivalId: Id;
    userId?: Id;
    ownerId: Id;
}

export type ICreateTicket = Pick<
    ITicket,
    'name' | 'price' | 'festivalId'
>;
export type IUpdateTicket = Partial<Omit<ITicket, 'id'>>;