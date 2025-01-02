import { Controller, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) { }

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
  @UseGuards(JwtAuthGuard)
  @Post(':blogId')
  addComment(
    @Param('blogId') blogId: string,
    @Body('content') content: string,
    @Request() req,
  ) {
    return this.commentsService.addComment(blogId, req.user.userId, content);
  }
}
