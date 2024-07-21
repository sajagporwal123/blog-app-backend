import { Test, TestingModule } from '@nestjs/testing';
import { IUser } from 'src/auth/interfaces/user.interface';
import { BlogsController } from './blogs.controller';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';

// Mock data
const mockBlog = {
  _id: '60d0fe4f5311236168a109ca',
  title: 'Mock Blog',
  content: 'This is a mock blog content',
  user: '60d0fe4f5311236168a109cb',
  createdAt: new Date(),
};

const mockBlogsService = {
  create: jest.fn().mockResolvedValue(mockBlog),
  findAll: jest.fn().mockResolvedValue({ data: [mockBlog], total: 1 }),
  findOne: jest.fn().mockResolvedValue(mockBlog),
  update: jest.fn().mockResolvedValue(mockBlog),
  delete: jest.fn().mockResolvedValue(mockBlog),
};

describe('BlogsController', () => {
  let blogsController: BlogsController;
  let blogsService: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogsController],
      providers: [{ provide: BlogsService, useValue: mockBlogsService }],
    }).compile();

    blogsController = module.get<BlogsController>(BlogsController);
    blogsService = module.get<BlogsService>(BlogsService);
  });

  it('should be defined', () => {
    expect(blogsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new blog', async () => {
      const createBlogDto: CreateBlogDto = {
        title: 'New Blog',
        content: 'Blog content',
      };
      const user: IUser = {
        _id: '60d0fe4f5311236168a109cb',
        email: 'user@example.com',
        name: 'testUser',
        id: '60d0fe4f5311236168a109cb',
        picture: 'dummy_url',
      };
      await expect(
        blogsController.create(createBlogDto, user),
      ).resolves.toEqual(mockBlog);
      expect(blogsService.create).toHaveBeenCalledWith(createBlogDto, user._id);
    });
  });

  describe('findAll', () => {
    it('should return all blogs with pagination', async () => {
      const page = '1';
      const limit = '10';
      await expect(blogsController.findAll(page, limit)).resolves.toEqual({
        data: [mockBlog],
        total: 1,
      });
      expect(blogsService.findAll).toHaveBeenCalledWith(
        Number(page),
        Number(limit),
      );
    });
  });

  describe('findOne', () => {
    it('should return a single blog by ID', async () => {
      const id = '60d0fe4f5311236168a109ca';
      await expect(blogsController.findOne(id)).resolves.toEqual(mockBlog);
      expect(blogsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a blog by ID', async () => {
      const id = '60d0fe4f5311236168a109ca';
      const updateBlogDto: UpdateBlogDto = {
        title: 'Updated Blog',
        content: 'Updated content',
      };
      await expect(blogsController.update(id, updateBlogDto)).resolves.toEqual(
        mockBlog,
      );
      expect(blogsService.update).toHaveBeenCalledWith(id, updateBlogDto);
    });
  });

  describe('delete', () => {
    it('should delete a blog by ID', async () => {
      const id = '60d0fe4f5311236168a109ca';
      await expect(blogsController.delete(id)).resolves.toEqual(mockBlog);
      expect(blogsService.delete).toHaveBeenCalledWith(id);
    });
  });
});
