import { IFestival } from "@festival-planner/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export type FestivalDocument = Festival & Document;

@Schema()
export class Festival implements IFestival {
    @IsMongoId()
    _id!: number;

    @Prop({ required: true })
    name!: string;

    @Prop()
    description!: string;

    @Prop()
    date!: Date;

    @Prop()
    location!: string;

    @Prop()
    is18Plus!: boolean;
}

export const FestivalSchema = SchemaFactory.createForClass(Festival);