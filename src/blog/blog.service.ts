import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
  ) { }

  // Create a new blog
  async create(createBlogDto: CreateBlogDto): Promise<Blog> {
    const newBlog = new this.blogModel(createBlogDto);
    return newBlog.save();
  }

  // Find all blogs
  async findAll(): Promise<Blog[]> {
    return this.blogModel.find().exec();
  }

  // Find a blog by ID
  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogModel.findById(id).exec();
    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return blog;
  }

  // Update a blog by ID
  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<Blog> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true, runValidators: true })
      .exec();
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return updatedBlog;
  }

  // Delete a blog by ID
  async remove(id: string): Promise<Blog> {
    const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
    if (!deletedBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return deletedBlog;
  }
}
