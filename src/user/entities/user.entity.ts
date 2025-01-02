import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ default: 'reader', enum: ['reader', 'author', 'admin'] })
    role: string;

    @Prop({ default: [] })
    savedBlogs: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
