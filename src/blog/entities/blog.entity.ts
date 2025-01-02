import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ required: true })
    author: string;

    @Prop({ default: [] })
    tags: string[];
}


export const BlogSchema = SchemaFactory.createForClass(Blog);