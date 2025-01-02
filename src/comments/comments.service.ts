import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';


@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) { }

  async addComment(blogId: string, userId: string, content: string): Promise<Comment> {
    const newComment = new this.commentModel({
      blog: blogId,
      author: userId,
      content,
    });
    return newComment.save();
  }

  async updateComment(comment: Comment, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    return this.commentModel.findByIdAndUpdate(comment._id, updateCommentDto, { new: true }).exec();
  }

  async deleteComment(comment: Comment): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(comment._id).exec();
  }
}