import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
    IsNumber
} from 'class-validator';
import { Type } from 'class-transformer';
import {
    ICreateTicket,
    IUpdateTicket
} from '@festival-planner/shared/api';

export class CreateTicketDto implements ICreateTicket {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    price!: number;

    @IsNotEmpty()
    @IsString()
    festivalId!: string;
}

export class UpdateTicketDto implements IUpdateTicket {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    purchaseDate!: Date;

    @IsOptional()
    @IsNumber()
    price!: number;

    @IsOptional()
    @IsString()
    festivalId!: string;

    @IsOptional()
    @IsString()
    userId!: string;
}
