import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
} from 'class-validator';
import {
    ICreateArtist,
    IUpdateArtist
} from '@festival-planner/shared/api';

export class CreateArtistDto implements ICreateArtist {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsString()
    genre!: string;

    @IsNotEmpty()
    @IsNumber()
    popularity!: number;

    @IsOptional()
    @IsString()
    description!: string;
}

export class UpdateArtistDto implements IUpdateArtist {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsString()
    genre!: string;

    @IsOptional()
    @IsNumber()
    popularity!: number;

    @IsOptional()
    @IsString()
    description!: string;
}