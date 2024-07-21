import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../constants/constants';
import {
  BLOG_DETAILS_FIELDS,
  BLOG_LIST_FIELDS,
  USER_DETAILS_FIELDS,
} from '../constants/fields';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IBlog } from './interfaces/blog.interface';

@Injectable()
export class BlogsService {
  private readonly logger = new Logger(BlogsService.name);

  constructor(@InjectModel('Blog') private readonly blogModel: Model<IBlog>) {}

  /**
   * Creates a new blog.
   *
   * @param createBlogDto - The DTO containing the details of the blog to create.
   * @param userId - The ID of the user creating the blog.
   * @returns The created blog.
   */
  async create(createBlogDto: CreateBlogDto, userId: string): Promise<IBlog> {
    this.logger.log(`Creating a new blog with title: ${createBlogDto.title}`);
    const createdBlog = new this.blogModel({ ...createBlogDto, user: userId });
    return createdBlog.save();
  }

  /**
   * Retrieves all blogs with pagination.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @returns An object containing the list of blogs and the total count.
   */
  async findAll(
    page: number = DEFAULT_PAGE_NUMBER,
    limit: number = DEFAULT_PAGE_SIZE,
  ): Promise<{ data: IBlog[]; total: number }> {
    this.logger.log(
      `Fetching blogs with pagination - Page: ${page}, Limit: ${limit}`,
    );
    const skip = (page - 1) * limit;
    const projection = BLOG_LIST_FIELDS.join(' '); // Select only the fields specified in BLOG_LIST_FIELDS
    const [data, total] = await Promise.all([
      this.blogModel
        .find()
        .sort({ createdAt: -1 }) // Sort blogs by creation date in descending order
        .skip(skip)
        .limit(limit)
        .select(projection)
        .populate('user', USER_DETAILS_FIELDS) // Populate user details in the blog
        .exec(),
      this.blogModel.countDocuments().exec(), // Get total count of blogs
    ]);
    this.logger.log(`Found ${total} blogs`);
    return { data, total };
  }

  /**
   * Retrieves a single blog by its ID.
   *
   * @param id - The ID of the blog to retrieve.
   * @returns The blog with the specified ID.
   */
  async findOne(id: string): Promise<IBlog> {
    this.logger.log(`Fetching blog with id: ${id}`);
    const projection = BLOG_DETAILS_FIELDS.join(' '); // Select only the fields specified in BLOG_DETAILS_FIELDS
    return this.blogModel
      .findById(id)
      .select(projection)
      .populate('user', USER_DETAILS_FIELDS) // Populate user details in the blog
      .exec();
  }

  /**
   * Updates a blog by its ID.
   *
   * @param id - The ID of the blog to update.
   * @param updateBlogDto - The DTO containing updated blog details.
   * @returns The updated blog.
   */
  async update(id: string, updateBlogDto: UpdateBlogDto): Promise<IBlog> {
    this.logger.log(`Updating blog with id: ${id}`);
    return this.blogModel
      .findByIdAndUpdate(id, updateBlogDto, { new: true })
      .exec();
  }

  /**
   * Deletes a blog by its ID.
   *
   * @param id - The ID of the blog to delete.
   * @returns The deleted blog.
   */
  async delete(id: string): Promise<IBlog> {
    this.logger.log(`Deleting blog with id: ${id}`);
    return this.blogModel.findByIdAndDelete(id).exec();
  }
}
