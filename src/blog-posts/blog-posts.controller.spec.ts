import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsController } from './blog-posts.controller';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('BlogPostsController', () => {
  let controller: BlogPostsController;
  let service: BlogPostsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [
        BlogPostsService,
        {
          provide: getModelToken('BlogPost'), // Adjust if needed based on your model name
          useValue: Model, // You can use a mock here if necessary
        },
      ],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
    service = module.get<BlogPostsService>(BlogPostsService);
  });

  describe('create', () => {
    it('should create a blog post', async () => {
      const createBlogPostDto: CreateBlogPostDto = {
        title: 'Test Title',
        content: 'Test Content',
        author: 'Test Author',
        createdAt: new Date(),
      };

      jest.spyOn(service, 'create').mockImplementation(async () => createBlogPostDto);

      expect(await controller.create(createBlogPostDto)).toBe(createBlogPostDto);
    });

    it('should throw BadRequestException if title is missing', async () => {
      const createBlogPostDto: any = {
        content: 'Test Content',
        author: 'Test Author',
        createdAt: new Date(),
      };

      await expect(controller.create(createBlogPostDto)).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if content is missing', async () => {
      const createBlogPostDto: any = {
        title: 'Test Title',
        author: 'Test Author',
        createdAt: new Date(),
      };

      await expect(controller.create(createBlogPostDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('update', () => {
    it('should update a blog post', async () => {
      const id = '123';
      const updateBlogPostDto: any = {
        title: 'Updated Title',
        content: 'Updated Content',
        author: 'Updated Author',
      };

      jest.spyOn(service, 'update').mockImplementation(async () => null);

      await expect(controller.update(id, updateBlogPostDto)).resolves.toBeUndefined();
    });

    it('should throw BadRequestException if title is empty', async () => {
      const id = '123';
      const updateBlogPostDto: any = {
        title: '',
        content: 'Updated Content',
        author: 'Updated Author',
      };

      await expect(controller.update(id, updateBlogPostDto)).rejects.toThrowError(BadRequestException);
    });

    it('should throw BadRequestException if content is empty', async () => {
      const id = '123';
      const updateBlogPostDto: any = {
        title: 'Updated Title',
        content: '',
        author: 'Updated Author',
      };

      await expect(controller.update(id, updateBlogPostDto)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getAll', () => {
    it('should get all blog posts', async () => {
      const result: any[] = [
        // Mock data here
      ];

      jest.spyOn(service, 'getAll').mockImplementation(async () => ({
        data: result,
        page: 1,
        totalItems: result.length,
        totalPages: 1,
      }));

      expect(await controller.getAll()).toEqual({
        data: result,
        page: 1,
        totalItems: result.length,
        totalPages: 1,
      });
    });
  });

  describe('search', () => {
    it('should search for blog posts', async () => {
      const query = 'search query';
      const result: any[] = [
        // Mock data here
      ];

      jest.spyOn(service, 'search').mockImplementation(async () => ({
        data: result,
        page: 1,
        totalItems: result.length,
        totalPages: 1,
      }));

      expect(await controller.search(query)).toEqual({
        data: result,
        page: 1,
        totalItems: result.length,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should find a blog post by ID', async () => {
      const id = '123';
      const result: any = {
        // Mock data here
      };

      jest.spyOn(service, 'findOne').mockImplementation(async () => result);

      expect(await controller.findOne(id)).toEqual(result);
    });
  });

  describe('delete', () => {
    it('should delete a blog post', async () => {
      const id = '123';

      jest.spyOn(service, 'delete').mockImplementation(async () => null);

      await expect(controller.delete(id)).resolves.toBeUndefined();
    });
  });
});
