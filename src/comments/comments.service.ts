import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './entities/comment.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommentsService {
  private readonly logger = new Logger('CommentsService');
  private readonly anonymousNames = [
    'Anonymous Cat', 'Anonymous Dog', 'Anonymous Fox', 'Anonymous Owl', 'Anonymous Panda',
    'Anonymous Bear', 'Anonymous Frog', 'Anonymous Tiger', 'Anonymous Wolf', 'Anonymous Rabbit'
  ];
  
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel('Blog') private blogModel: Model<any>,
    @InjectModel('User') private userModel: Model<any>,
  ) {}

  // Generate a random anonymous name
  private generateAnonymousName(): string {
    const randomIndex = Math.floor(Math.random() * this.anonymousNames.length);
    return `${this.anonymousNames[randomIndex]}-${uuidv4().substring(0, 6)}`;
  }

  async addComment(createCommentDto: CreateCommentDto): Promise<any> {
    // Validate blogId (ensure the blog exists)
    const blogExists = await this.blogModel.exists({ _id: createCommentDto.blog });
    if (!blogExists) {
      throw new NotFoundException('Blog not found');
    }

    let commenterInfo = null;
    let anonymousName = null;

    // If commenter is provided, validate that user exists and get their username
    if (createCommentDto.commenter) {
      const user = await this.userModel.findById(createCommentDto.commenter).exec();
      if (user) {
        commenterInfo = { id: user._id, username: user.username, role: user.role };
      } else {
        this.logger.warn(`User ID ${createCommentDto.commenter} not found, creating anonymous comment`);
        anonymousName = this.generateAnonymousName();
      }
    } else {
      // Generate anonymous name for non-authenticated users
      anonymousName = this.generateAnonymousName();
    }

    const newComment = new this.commentModel({
      blog: createCommentDto.blog,
      commenter: commenterInfo ? commenterInfo.id : null,
      content: createCommentDto.content,
      isAnonymous: !commenterInfo,
      anonymousName: anonymousName
    });
    
    // Save the comment
    await newComment.save();
    
    // Fetch the saved comment and transform for response
    const savedComment = await this.commentModel
      .findById(newComment._id)
      .populate('commenter', 'username role -_id')
      .lean()
      .exec();

    // Transform the response to include commenter username or anonymous name
    if (savedComment.commenter) {
      return savedComment;
    } else {
      return {
        ...savedComment,
        commenterName: anonymousName
      };
    }
  }

  async updateComment(comment: Comment, updateCommentDto: UpdateCommentDto): Promise<any> {
    const updatedComment = await this.commentModel
      .findByIdAndUpdate(comment._id, updateCommentDto, { new: true })
      .populate('commenter', 'username role -_id')
      .lean()
      .exec();

    if (!updatedComment) {
      throw new NotFoundException('Comment not found');
    }

    // Transform the response to include commenter username or anonymous name
    if (!updatedComment.commenter && updatedComment.anonymousName) {
      return {
        ...updatedComment,
        commenterName: updatedComment.anonymousName
      };
    }

    return updatedComment;
  }

  async deleteComment(comment: Comment): Promise<any> {
    const deletedComment = await this.commentModel
      .findByIdAndDelete(comment._id)
      .populate('commenter', 'username role -_id')
      .lean()
      .exec();

    if (!deletedComment) {
      throw new NotFoundException('Comment not found');
    }

    // Transform the response to include commenter username or anonymous name
    if (!deletedComment.commenter && deletedComment.anonymousName) {
      return {
        ...deletedComment,
        commenterName: deletedComment.anonymousName
      };
    }

    return deletedComment;
  }

  async findCommentById(commentId: string): Promise<any> {
    const comment = await this.commentModel
      .findById(commentId)
      .populate('commenter', 'username role -_id')
      .lean()
      .exec();

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Transform the response to include commenter username or anonymous name
    if (!comment.commenter && comment.anonymousName) {
      return {
        ...comment,
        commenterName: comment.anonymousName
      };
    }

    return comment;
  }

  async findAllComments(): Promise<any[]> {
    const comments = await this.commentModel
      .find()
      .populate('commenter', 'username role -_id')
      .lean()
      .exec();

    // Transform the response to include commenter username or anonymous name for each comment
    return comments.map(comment => {
      if (!comment.commenter && comment.anonymousName) {
        return {
          ...comment,
          commenterName: comment.anonymousName
        };
      }
      return comment;
    });
  }
}