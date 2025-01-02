import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../../user/entities/user.entity';
import { Blog } from '../../blog/entities/blog.entity';

@Schema({ timestamps: true })
export class Comment extends Document {
    @Prop({ type: Types.ObjectId, ref: 'Blog', required: true })
    blog: Blog;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    author: User;

    @Prop({ required: true })
    content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);