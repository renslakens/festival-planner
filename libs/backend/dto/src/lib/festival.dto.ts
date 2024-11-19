import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsDate
} from 'class-validator';
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
}

export class UpdateFestivalDto implements IUpdateFestival {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsDate()
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
}

