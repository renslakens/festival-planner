import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate
} from 'class-validator';
import {
    ICreateTicket,
    IUpdateTicket
} from '@festival-planner/shared/api';

export class CreateTicketDto implements ICreateTicket {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsDate()
    purchaseDate!: Date;

    @IsNotEmpty()
    price!: number;

    @IsNotEmpty()
    festivalId!: string;

    @IsNotEmpty()
    userId!: string;
}

export class UpdateTicketDto implements IUpdateTicket {
    @IsOptional()
    @IsString()
    name!: string;

    @IsOptional()
    @IsDate()
    purchaseDate!: Date;

    @IsOptional()
    price!: number;

    @IsOptional()
    festivalId!: string;

    @IsOptional()
    userId!: string;
}

