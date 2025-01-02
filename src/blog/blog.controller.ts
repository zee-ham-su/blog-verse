import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { BlogService } from './blog.service';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@ApiTags('blogs')
@Controller('blogs')
export class BlogController {
  constructor(private readonly blogService: BlogService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
  @ApiResponse({ status: 201, description: 'The blog post has been successfully created.', type: Blog })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createBlogDto: CreateBlogDto) {
    return this.blogService.create(createBlogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Return all blog posts.', type: Blog })
  findAll() {
    return this.blogService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a blog post by id' })
  @ApiParam({ name: 'id', required: true, description: 'The id of the blog post' })
  @ApiResponse({ status: 200, description: 'Return the blog post.', type: Blog })
  @ApiResponse({ status: 404, description: 'Blog post not found.' })
  findOne(@Param('id') id: string) {
    return this.blogService.findOne(id);
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