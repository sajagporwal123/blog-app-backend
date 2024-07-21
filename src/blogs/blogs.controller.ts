import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { User } from '../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IUser } from '../auth/interfaces/user.interface';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE } from '../constants/constants';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { IBlog } from './interfaces/blog.interface';
import { ValidateObjectIdPipe } from '../pipe/validate-object-id.pipe';

@ApiTags('blogs')
@Controller('blogs')
export class BlogsController {
  private readonly logger = new Logger(BlogsController.name);

  constructor(private readonly blogsService: BlogsService) {}

  /**
   * Creates a new blog.
   *
   * @param createBlogDto - The DTO containing blog creation details.
   * @param user - The currently authenticated user.
   * @returns The created blog.
   */
  @Post()
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a new blog' })
  @ApiResponse({
    status: 201,
    description: 'The blog has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  @ApiBody({ type: CreateBlogDto })
  async create(
    @Body() createBlogDto: CreateBlogDto,
    @User() user: IUser,
  ): Promise<IBlog> {
    this.logger.log(
      `Received request to create a new blog with title: ${createBlogDto.title}`,
    );
    return this.blogsService.create(createBlogDto, user._id);
  }

  /**
   * Retrieves all blogs with pagination.
   *
   * @param page - The page number for pagination.
   * @param limit - The number of items per page.
   * @returns An object containing the list of blogs and the total count.
   */
  @Get()
  @SkipThrottle({ default: false })
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all blogs with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Return all blogs with pagination.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<{ data: IBlog[]; total: number }> {
    const pageNumber = parseInt(page, 10) || DEFAULT_PAGE_NUMBER;
    const pageSize = parseInt(limit, 10) || DEFAULT_PAGE_SIZE;
    this.logger.log(
      `Received request to fetch blogs - Page: ${pageNumber}, Limit: ${pageSize}`,
    );
    return this.blogsService.findAll(pageNumber, pageSize);
  }

  /**
   * Retrieves a single blog by its ID.
   *
   * @param id - The ID of the blog to retrieve.
   * @returns The blog with the specified ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a single blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the blog with the specified ID.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the blog to retrieve',
    example: '60d0fe4f5311236168a109ca',
  })
  async findOne(@Param('id', ValidateObjectIdPipe) id: string): Promise<IBlog> {
    this.logger.log(`Received request to fetch blog with id: ${id}`);
    const blog = await this.blogsService.findOne(id);
    if (!blog) {
      throw new NotFoundException(`Blog with ID "${id}" not found`);
    }
    return blog;
  }

  /**
   * Updates a blog by its ID.
   *
   * @param id - The ID of the blog to update.
   * @param updateBlogDto - The DTO containing updated blog details.
   * @returns The updated blog.
   */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the blog to update',
    example: '60d0fe4f5311236168a109ca',
  })
  @ApiBody({ type: UpdateBlogDto })
  async update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<IBlog> {
    this.logger.log(`Received request to update blog with id: ${id}`);
    return this.blogsService.update(id, updateBlogDto);
  }

  /**
   * Deletes a blog by its ID.
   *
   * @param id - The ID of the blog to delete.
   * @returns The deleted blog.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Delete a blog by ID' })
  @ApiResponse({
    status: 200,
    description: 'The blog has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Blog not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the blog to delete',
    example: '60d0fe4f5311236168a109ca',
  })
  async delete(@Param('id', ValidateObjectIdPipe) id: string): Promise<IBlog> {
    this.logger.log(`Received request to delete blog with id: ${id}`);
    return this.blogsService.delete(id);
  }
}
