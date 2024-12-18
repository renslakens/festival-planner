import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsNumber,
    IsBoolean
} from 'class-validator';
import {
    ICreateStage,
    IUpdateStage
} from '@festival-planner/shared/api';

export class CreateStageDto implements ICreateStage {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    capacity!: number;

    @IsNotEmpty()
    @IsBoolean()
    covered!: boolean;

    @IsNotEmpty()
    @IsString()
    festivalId!: string;

    @IsOptional()
    @IsString()
    performances!: string[];
}

export class UpdateStageDto implements IUpdateStage {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsNumber()
    capacity!: number;

    @IsOptional()
    @IsBoolean()
    covered!: boolean;

    @IsOptional()
    @IsString()
    festivalId!: string;

    @IsOptional()
    @IsString()
    performances!: string[];
}

