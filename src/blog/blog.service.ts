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
  async create(createBlogDto: CreateBlogDto, userId: string): Promise<Blog> {
    const newBlog = new this.blogModel({
      ...createBlogDto,
      author: userId,
    });
    return newBlog.save();
  }

  // Find all blogs
  async findAll(page: number = 1, limit: number = 10): Promise<Blog[]> {
    const skip = (page - 1) * limit;
    return this.blogModel.find().skip(skip).limit(limit).exec();
  }


  // Find a blog by tag
  async findByTag(tag: string): Promise<Blog[]> {
    return this.blogModel.find({ tags: tag }).exec();
  }


  // Find a blog by a user
  async findByUser(userId: string): Promise<Blog[]> {
    return this.blogModel.find({ author: userId }).exec();
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
