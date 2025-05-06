import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from './entities/comment.entity';
import { BlogSchema } from '../blog/entities/blog.entity';
import { UserSchema } from '../user/entities/user.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: 'Blog', schema: BlogSchema },
      { name: 'User', schema: UserSchema }
    ])
  ],
  controllers: [CommentsController],
  providers: [CommentsService]
})
export class CommentsModule { }
