import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean,
    IsDate
} from 'class-validator';
import {
    ICreatePerformance,
    IUpdatePerformance
} from '@festival-planner/shared/api';

export class CreatePerformanceDto implements ICreatePerformance {
    @IsNotEmpty()
    @IsDate()
    dateTime!: Date;

    @IsNotEmpty()
    @IsNumber()
    period!: number;

    @IsNotEmpty()
    @IsString()
    specialFeatures!: string;

    @IsNotEmpty()
    @IsString()
    description!: string;

    @IsNotEmpty()
    @IsString()
    stageId!: string;

    @IsNotEmpty()
    @IsString()
    artistId!: string;
}

export class UpdatePerformanceDto implements IUpdatePerformance {
    @IsOptional()
    @IsDate()
    dateTime!: Date;

    @IsOptional()
    @IsNumber()
    period!: number;

    @IsOptional()
    @IsString()
    specialFeatures!: string;

    @IsOptional()
    @IsString()
    description!: string;

    @IsOptional()
    @IsString()
    stageId!: string;

    @IsOptional()
    @IsString()
    artistId!: string;
}