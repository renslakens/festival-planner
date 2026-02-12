import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    ICreateFestival,
    IUpdateFestival
} from '@festival-planner/shared/api';

export class CreateFestivalDto implements ICreateFestival {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    date!: Date;

    @IsNotEmpty()
    @IsString()
    location!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsOptional()
    @IsBoolean()
    is18Plus!: boolean;

    @IsOptional()
    @IsString()
    stages!: string[];
}

export class UpdateFestivalDto implements IUpdateFestival {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date!: Date;

    @IsOptional()
    @IsString()
    location!: string;

    @IsOptional()
    @IsString()
    description!: string;

    @IsOptional()
    @IsBoolean()
    is18Plus!: boolean;

    @IsOptional()
    @IsString()
    stages!: string[];
}