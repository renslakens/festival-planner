
import { IArtist } from "@festival-planner/shared/api";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsMongoId } from "class-validator";

export type ArtistDocument = Artist & Document;

@Schema()
export class Artist implements IArtist {
    @IsMongoId()
    _id!: string;

    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    genre!: string;

    @Prop({ required: true })
    popularity!: number;

    @Prop({ required: true })
    description!: string;
}

export const ArtistSchema = SchemaFactory.createForClass(Artist);