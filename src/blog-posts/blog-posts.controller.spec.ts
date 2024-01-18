import { Test, TestingModule } from '@nestjs/testing';
import { BlogPostsController } from './blog-posts.controller';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { BlogPostsService } from './blog-posts.service';

describe('BlogPosts Controller', () => {
  let controller: BlogPostsController;
  let service: BlogPostsService;
  const createBlogPostDto: CreateBlogPostDto = {
    title: 'Title #1',
    content: 'Content #1',
    author: 'Author #1',
    createdAt: new Date('2024-01-16T19:20:21.2223Z'),
  };

  const mockBlogPost = {
    title: 'Title #1',
    content: 'Content #1',
    author: 'Author #1',
    createdAt: new Date('2024-01-16T19:20:21.2223Z'),
    _id: 'a id',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlogPostsController],
      providers: [
        {
          provide: BlogPostsService,
          useValue: {
            getAll: jest.fn().mockResolvedValue({
              data: [
                {
                  title: 'Title #1',
                  content: 'Content #1',
                  author: 'Author #1',
                  createdAt: new Date('2024-01-16T19:20:21.2223Z'),
                },
                {
                  title: 'Title #2',
                  content: 'Content #2',
                  author: 'Author #2',
                  createdAt: new Date('2024-01-16T19:20:21.2223Z'),
                },
                {
                  title: 'Title #3',
                  content: 'Content #3',
                  author: 'Author #3',
                  createdAt: new Date('2024-01-16T19:20:21.2223Z'),
                },
              ],
              page: 1,
              totalItems: 3,
              totalPages: 1,
            }),
            create: jest.fn().mockResolvedValue(mockBlogPost),
          },
        },
      ],
    }).compile();

    controller = module.get<BlogPostsController>(BlogPostsController);
    service = module.get<BlogPostsService>(BlogPostsService);
  });

  describe('create()', () => {
    it('should create a new blog post', async () => {
      const createSpy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockBlogPost);

      await controller.create(createBlogPostDto);
      expect(createSpy).toHaveBeenCalledWith(createBlogPostDto);
    });
  });

  describe('getAll()', () => {
    it('should return an array of blog posts', async () => {
      await expect(controller.getAll()).resolves.toEqual({
        data: [
          {
            title: 'Title #1',
            content: 'Content #1',
            author: 'Author #1',
            createdAt: new Date('2024-01-16T19:20:21.2223Z'),
          },
          {
            title: 'Title #2',
            content: 'Content #2',
            author: 'Author #2',
            createdAt: new Date('2024-01-16T19:20:21.2223Z'),
          },
          {
            title: 'Title #3',
            content: 'Content #3',
            author: 'Author #3',
            createdAt: new Date('2024-01-16T19:20:21.2223Z'),
          },
        ],
        page: 1,
        totalItems: 3,
        totalPages: 1,
      });
      expect(service.getAll).toHaveBeenCalled();
    });
  });
});
