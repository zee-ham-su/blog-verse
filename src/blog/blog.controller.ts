import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../utils/multer.config';

@ApiTags('blog')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'author')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'Blog post created successfully', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid input data' })
  create(@Body() createBlogDto: CreateBlogDto, @Request() req) {
    return this.blogService.create(createBlogDto, req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'author')
  @Post(':id/upload')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload media files to a blog post' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post' })
  @ApiResponse({ status: 200, description: 'Files uploaded successfully', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request: Invalid file format or size' })
  @ApiResponse({ status: 404, description: 'Blog post not found' })
  @UseInterceptors(FilesInterceptor('files', 10, multerConfig))
  uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogService.uploadFiles(id, files);
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

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a blog by slug' })
  @ApiParam({ name: 'slug', required: true, description: 'The slug of the blog' })
  @ApiResponse({ status: 200, description: 'Return the blog.', type: Blog })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  findBySlug(@Param('slug') slug: string) {
    return this.blogService.findBySlug(slug);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'author')
  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a blog post' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post to update' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully updated.', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  update(@Param('id') id: string, @Body() updateBlogDto: UpdateBlogDto) {
    return this.blogService.update(id, updateBlogDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'author')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a blog post' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post to delete' })
  @ApiResponse({ status: 200, description: 'The blog post has been successfully deleted.', type: Blog })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  remove(@Param('id') id: string) {
    return this.blogService.remove(id);
  }
}