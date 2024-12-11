
import { IStage } from "@festival-planner/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export type StageDocument = Stage & Document;

@Schema()
export class Stage implements IStage {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    capacity!: number;

    @Prop({ required: true })
    covered!: boolean;

    @Prop({ required: true })
    festivalId!: string;

    @Prop()
    performances!: string[];
}

export const StageSchema = SchemaFactory.createForClass(Stage);