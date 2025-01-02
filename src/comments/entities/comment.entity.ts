import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Blog } from '../../blog/entities/blog.entity';
import { User } from '../../user/entities/user.entity';

@Schema()
export class Comment extends Document {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Blog', required: true })
    blog: Blog;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
    commenter: User | null; // Renamed field

    @Prop({ required: true })
    content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);