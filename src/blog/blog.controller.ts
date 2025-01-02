import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'The blog post has been successfully created.', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Return all blog posts.', type: Blog })
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.blogService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by id' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post' })
  @ApiResponse({ status: 200, description: 'Return the blog post.', type: Blog })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
  }

  @Get('tag/:tag')
  @ApiOperation({ summary: 'Get blog posts by tag' })
  @ApiParam({ name: 'tag', required: true, description: 'The tag of the blog posts' })
  @ApiResponse({ status: 200, description: 'Return the blog posts with the specified tag.', type: Blog })
  findByTag(@Param('tag') tag: string) {
    return this.blogService.findByTag(tag);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get blog posts by user' })
  @ApiParam({ name: 'userId', required: true, description: 'The id of the user' })
  @ApiResponse({ status: 200, description: 'Return the blog posts of the specified user.', type: Blog })
  findByUser(@Param('userId') userId: string) {
    return this.blogService.findByUser(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post to update' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully updated.', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post to delete' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully deleted.', type: Blog })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}