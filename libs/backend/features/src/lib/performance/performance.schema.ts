
import { IPerformance, } from "@festival-planner/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export type PerformanceDocument = Performance & Document;

@Schema()
export class Performance implements IPerformance {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true })
    dateTime!: Date;

    @Prop({ required: true })
    period!: number;

    @Prop({ required: true })
    specialFeatures!: string;

    @Prop({ required: true })
    description!: string;

    @Prop({ required: true })
    stageId!: string;

    @Prop({ required: true })
    artistId!: string;
}

export const PerformanceSchema = SchemaFactory.createForClass(Performance);