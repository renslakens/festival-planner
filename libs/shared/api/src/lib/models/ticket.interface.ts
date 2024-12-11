import { Id } from './id.type';

export interface ITicket {
    _id: Id;
    name: string;
    purchaseDate: Date;
    price: number;
    festivalId: Id;
    userId: Id;
}

export type ICreateTicket = Pick<
    ITicket,
    'name' | 'purchaseDate' | 'price' | 'festivalId' | 'userId'
>;
export type IUpdateTicket = Partial<Omit<ITicket, 'id'>>;

// export interface ITicketResponse {
//     results: ITicket;
// }