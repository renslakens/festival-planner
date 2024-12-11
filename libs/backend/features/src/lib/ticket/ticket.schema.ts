import { ITicket } from "@festival-planner/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export type TicketDocument = Ticket & Document;

@Schema()
export class Ticket implements ITicket {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop()
    purchaseDate!: Date;

    @Prop({ required: true })
    price!: number;

    @Prop({ required: true })
    festivalId!: string;

    @Prop()
    userId!: string;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);