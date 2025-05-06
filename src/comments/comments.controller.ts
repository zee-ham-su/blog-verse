import { Controller, Post, Get, Body, Param, UseGuards, Request, Patch, Delete, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Comment } from './entities/comment.entity';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';
import { CommentsService } from './comments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

  @UseGuards(OptionalJwtAuthGuard, RolesGuard)
  @Roles('admin', 'reader', 'author')
  @Post(':blogId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new comment to a blog' })
  @ApiResponse({ status: 201, description: 'Comment created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiParam({
    name: 'blogId',
    required: true,
    description: 'The ID of the blog to add a comment to',
    type: String,
    example: '63c9f7f40e4d9f8e4c9a1c7b',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'This is a great blog post!' },
      },
      required: ['content'],
    },
  })
  addComment(
    @Param('blogId') blogId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    const commenterId = req.user ? req.user.userId : null;
    return this.commentsService.addComment(blogId, commenterId, content);
  }

  @Get(':commentId')
  @ApiOperation({ summary: 'Get a comment by ID' })
  @ApiResponse({ status: 200, description: 'Returns the comment', type: Comment })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  async findCommentById(@Param('commentId') commentId: string): Promise<Comment> {
    return this.commentsService.findCommentById(commentId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments' })
  @ApiResponse({ status: 200, description: 'Returns an array of all comments', type: [Comment] })
  async findAllComments(): Promise<Comment[]> {
    return this.commentsService.findAllComments();
  }

  @ApiOperation({ summary: 'Update a comment' })
  @ApiResponse({ status: 200, description: 'Comment updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'The ID of the comment to update',
    type: String,
    example: '63c9f7f40e4d9f8e4c9a1c7b',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        content: { type: 'string', example: 'This is an updated comment!' },
      },
    },
  })
  @Patch(':commentId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiBearerAuth()
  async updateComment(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req
  ) {
    const comment = await this.commentsService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Authorization check (if using OptionalJwtAuthGuard):
    if (comment.commenter && comment.commenter.toString() !== req.user.userId) {
      // Or handle as needed.
      throw new UnauthorizedException('You are not authorized to update this comment.');
    }
    return this.commentsService.updateComment(comment, updateCommentDto);
  }

  @UseGuards(OptionalJwtAuthGuard, RolesGuard)
  @Roles('admin', 'reader', 'author')
  @Delete(':commentId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  @ApiParam({
    name: 'commentId',
    required: true,
    description: 'The ID of the comment to delete',
    type: String,
    example: '63c9f7f40e4d9f8e4c9a1c7b',
  })
  async deleteComment(
    @Param('commentId') commentId: string,
    @Request() req
  ) {
    const comment = await this.commentsService.findCommentById(commentId);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    // Authorization check (if using OptionalJwtAuthGuard):
    if (comment.commenter && comment.commenter.toString() !== req.user.userId) {
      throw new UnauthorizedException('You are not authorized to delete this comment.');
    }
    return this.commentsService.deleteComment(comment);
  }
}

