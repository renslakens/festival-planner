import { Id } from './id.type';

export interface IArtist {
    _id: Id;
    name: string;
    genre: string;
    popularity: number;
    description: string;
}

export type ICreateArtist = Pick<
    IArtist,
    'name' | 'genre' | 'popularity' | 'description'
>;
export type IUpdateArtist = Partial<Omit<IArtist, 'id'>>;

// export interface IArtistResponse {
//     results: IArtist;
// }