import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel('Blog') private blogModel: Model<any>, // Assuming Blog model is registered with Mongoose
  ) {}

  async addComment(blogId: string, commenterId: string | null, content: string): Promise<Comment> {
    // Validate blogId (ensure the blog exists)
    const blogExists = await this.blogModel.exists({ _id: blogId });
    if (!blogExists) {
      throw new NotFoundException('Blog not found');
    }

    const newComment = new this.commentModel({
      blog: blogId,
      commenter: commenterId, // `null` for anonymous comments
      content,
      isAnonymous: !commenterId, // Set `isAnonymous` to `true` if `commenterId` is `null`
    });
    return newComment.save();
  }

  async updateComment(comment: Comment, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(comment._id, updateCommentDto, { new: true }).exec();

    if (!updatedComment) {
      throw new NotFoundException('Comment not found');
    }

    return updatedComment;
  }

  async deleteComment(comment: Comment): Promise<Comment> {
    const deletedComment = await this.commentModel.findByIdAndDelete(comment._id).exec();

    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }

    return deletedComment;
  }

  async findCommentById(commentId: string): Promise<Comment> {
    const comment = await this.commentModel.findById(commentId).exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async findAllComments(): Promise<Comment[]> {
    return this.commentModel.find().populate('commenter').exec();
  }
}