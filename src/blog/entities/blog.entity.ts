import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';


@Schema({ timestamps: true })
export class Blog extends Document {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true })
    content: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ default: [] })
    tags: string[];
}


export const BlogSchema = SchemaFactory.createForClass(Blog);