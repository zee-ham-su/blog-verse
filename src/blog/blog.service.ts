import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { slugify } from 'src/utils/slugify';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/utils/app.config';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class BlogService {
  constructor(
    @InjectModel(Blog.name) private readonly blogModel: Model<Blog>,
    private configService: ConfigService,
  ) { }

  // Create a new blog
  async create(createBlogDto: CreateBlogDto, userId: string): Promise<Blog> {
    console.log(userId);

    // Generate slug from title if not provided
    let slug = createBlogDto.slug || slugify(createBlogDto.title);

    // Ensure slug is unique
    let uniqueSlug = slug;
    let count = 1;
    while (await this.blogModel.exists({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${count}`;
      count++;
    }

    const newBlog = new this.blogModel({
      ...createBlogDto,
      slug: uniqueSlug,
      author: userId,
    });
    return newBlog.save();
  }

  // Helper method to transform blog data with full URLs
  private transformBlogMedia(blog: Blog): any {
    const transformed = blog.toObject ? blog.toObject() : { ...blog };
    
    if (transformed.media && Array.isArray(transformed.media)) {
      transformed.media = transformed.media.map(path => 
        AppConfig.getFileUrl(this.configService, path)
      );
    }
    
    return transformed;
  }

  // Helper to transform an array of blogs
  private transformBlogsMedia(blogs: Blog[]): any[] {
    return blogs.map(blog => this.transformBlogMedia(blog));
  }

  // Find all blogs
  async findAll(page: number = 1, limit: number = 10): Promise<any[]> {
    const skip = (page - 1) * limit;
    const blogs = await this.blogModel.find()
      .skip(skip)
      .limit(limit)
      .populate('author', 'username email -_id')
      .exec();
      
    return this.transformBlogsMedia(blogs);
  }

  // Find a blog by tag
  async findByTag(tag: string): Promise<any[]> {
    const blogs = await this.blogModel.find({ tags: tag })
      .populate('author', 'username email -_id')
      .exec();
      
    return this.transformBlogsMedia(blogs);
  }

  // Find a blog by a user
  async findByUser(userId: string): Promise<any[]> {
    const blogs = await this.blogModel.find({ author: userId })
      .populate('author', 'username email -_id')
      .exec();
      
    return this.transformBlogsMedia(blogs);
  }

  // Find a blog by ID
  async findOne(id: string): Promise<any> {
    const blog = await this.blogModel.findById(id)
      .populate('author', 'username email -_id')
      .exec();
      
    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    
    return this.transformBlogMedia(blog);
  }

  // Find a blog by slug
  async findBySlug(slug: string): Promise<any> {
    const blog = await this.blogModel.findOne({ slug })
      .populate('author', 'username email -_id')
      .exec();
      
    if (!blog) {
      throw new NotFoundException(`Blog with slug "${slug}" not found`);
    }
    
    return this.transformBlogMedia(blog);
  }

  // Upload files to a blog post
  async uploadFiles(id: string, files: Express.Multer.File[]): Promise<any> {
    // Get the original document first
    const blogDoc = await this.blogModel.findById(id);
    
    if (!blogDoc) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    
    // Check if files exist and is not empty
    if (!files || files.length === 0) {
      return this.findOne(id); // Return the blog without making changes if no files
    }
    
    // Get the file paths
    const filePaths = files.map(file => `uploads/${file.filename}`);
    
    // Update the blog with new media files
    blogDoc.media = blogDoc.media ? [...blogDoc.media, ...filePaths] : filePaths;
    
    // Save the document
    await blogDoc.save();
    
    // Retrieve the updated document with populated fields
    return this.findOne(id);
  }

  // Update a blog by ID
  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<any> {
    const updatedBlog = await this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true, runValidators: true })
      .populate('author', 'username email -_id')
      .exec();
      
    if (!updatedBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    
    return this.transformBlogMedia(updatedBlog);
  }

  // Helper method to delete a file
  private async deleteFile(filePath: string): Promise<void> {
    try {
      // Extract the filename from the path
      const filename = filePath.split('/').pop();
      const fullPath = join(process.cwd(), 'uploads', filename);
      
      // Check if file exists before attempting to delete
      await fs.access(fullPath);
      await fs.unlink(fullPath);
      console.log(`Successfully deleted file: ${fullPath}`);
    } catch (error) {
      // Just log the error but don't throw - we don't want to stop the blog deletion if file deletion fails
      console.error(`Error deleting file ${filePath}:`, error.message);
    }
  }

  // Delete a specific media file from a blog post
  async deleteMediaFile(id: string, filename: string): Promise<any> {
    // Find the blog
    const blog = await this.blogModel.findById(id);
    
    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    
    // Check if the blog has the media file
    const mediaPath = `uploads/${filename}`;
    const mediaIndex = blog.media ? blog.media.findIndex(m => m === mediaPath) : -1;
    
    if (mediaIndex === -1) {
      throw new NotFoundException(`Media file "${filename}" not found in this blog post`);
    }
    
    // Delete the file from the filesystem
    await this.deleteFile(mediaPath);
    
    // Remove the file from the blog's media array
    blog.media.splice(mediaIndex, 1);
    await blog.save();
    
    // Return the updated blog with populated fields and transformed media URLs
    return this.findOne(id);
  }

  // Delete a blog by ID and its associated files
  async remove(id: string): Promise<any> {
    const deletedBlog = await this.blogModel.findByIdAndDelete(id)
      .populate('author', 'username email -_id')
      .exec();
      
    if (!deletedBlog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    
    // Delete all associated media files
    if (deletedBlog.media && deletedBlog.media.length > 0) {
      const deletePromises = deletedBlog.media.map(filePath => this.deleteFile(filePath));
      await Promise.all(deletePromises);
    }
    
    return this.transformBlogMedia(deletedBlog);
  }
}
