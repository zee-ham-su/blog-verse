import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';


@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) { }

  async addComment(blogId: string, commenterId: string | null, content: string): Promise<Comment> {
    const newComment = new this.commentModel({
      blog: blogId,
      commenter: commenterId, // `null` for anonymous comments
      content,
      isAnonymous: !commenterId, // Set `isAnonymous` to `true` if `commenterId` is `null`
    });
    return newComment.save();
  }

  //Update Example
  async updateComment(comment: Comment, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(comment._id, updateCommentDto, { new: true }).exec(); // Use exec() to return a promise

    return updatedComment;
  }


  async deleteComment(comment: Comment): Promise<Comment> {
    return this.commentModel.findByIdAndDelete(comment._id).exec();
  }

  async findCommentById(commentId: string): Promise<Comment> {
    return this.commentModel.findById(commentId).exec();
  }

  async findAllComments(): Promise<Comment[]> {
    return this.commentModel.find().populate('commenter').exec();
  }
}