import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { BlogPost } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';

@Injectable()
export class BlogPostsService {
  constructor(@InjectModel(BlogPost.name) private readonly blogPostModel: Model<BlogPost>) {}

  async create(createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    const createdBlogPost = await this.blogPostModel.create({...createBlogPostDto, createdAt: new Date()});
    return createdBlogPost;
  }

  async update(id: string, updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
    return this.blogPostModel.findByIdAndUpdate(id, updateBlogPostDto);
  }

  async getAll(page = 1, pageSize = 10): Promise<{ data: BlogPost[]; page: number; totalItems: number; totalPages: number }> {
    const totalItems = await this.count();
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.blogPostModel
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return {
      data,
      page,
      totalItems,
      totalPages,
    };
  }

  async search(query: string, page = 1, pageSize = 10, sortBy: string): Promise<{ data: BlogPost[]; page: number; totalItems: number; totalPages: number }> {
    const regexQuery = new RegExp(query, 'i');

    const totalItems = await this.blogPostModel.countDocuments({
      $or: [{ title: regexQuery }, { content: regexQuery }],
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.blogPostModel
      .find({
        $or: [{ title: regexQuery }, { content: regexQuery }],
      })
      .sort({ [sortBy]: 1 }) // Sort by ascending order (1) based on the specified field
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .exec();

    return {
      data,
      page,
      totalItems,
      totalPages,
    };
  }

  async count(): Promise<number> {
    return this.blogPostModel.find().countDocuments().exec();
  }

  async findOne(id: string): Promise<BlogPost> {
    return this.blogPostModel.findOne({ _id: id }).exec();
  }

  async delete(id: string) {
    const deletedBlogPost = await this.blogPostModel
      .findOneAndDelete({ _id: id })
      .exec();
    return deletedBlogPost;
  }
}
