import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, Query } from '@nestjs/common';
import { BlogPostsService } from './blog-posts.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { BlogPost } from './schemas/blog-post.schema';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import mongoose from 'mongoose';

@Controller('blog-posts')
export class BlogPostsController {
  constructor(private readonly blogPostsService: BlogPostsService) {}

  @Post()
  async create(@Body() createBlogPostDto: CreateBlogPostDto) {
    try {
        if (!createBlogPostDto.title){
            throw new BadRequestException("Title is required");
        }
        if (!createBlogPostDto.content){
            throw new BadRequestException("Content is required");
        }

        const created = await this.blogPostsService.create({
            ...createBlogPostDto,
            createdAt: process.env.NODE_ENV == 'test' ? createBlogPostDto.createdAt : new Date() //accept the date as input during test
        });
        return created;

    } catch (error: any) {
        console.error('Error (create):', JSON.stringify(error));
        throw error;
    }
  }

  @Put(':id')
  async update(@Param('id') id:string, @Body() updateBlogPostDto: UpdateBlogPostDto) {
    try {
        if (!id) {
            throw new BadRequestException("Id is required");
        }
        
        if (!mongoose.Types.ObjectId.isValid(id)){
            throw new BadRequestException("Id is invalid")
        }

        if (!(await this.blogPostsService.findOne(id))) {
            throw new NotFoundException("Blog entry not found");
        }

        const updated = await this.blogPostsService.update(id, updateBlogPostDto);
        return updated;
    } catch (error) {
        console.error('Error (update):', JSON.stringify(error));
        throw error;
    }
  }

  //TODO: Consider setting a max pageSize to prevent potential attacks
  @Get()
  async getAll(
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ): Promise<{ data: BlogPost[]; page: number; totalItems: number; totalPages: number }> {
    try {
      const result = await this.blogPostsService.getAll(+page, +pageSize);

      return {
        data: result.data,
        page: result.page,
        totalItems: result.totalItems,
        totalPages: result.totalPages,
      };
    } catch (error) {
      console.error('Error (find):', JSON.stringify(error));
      throw error;
    }
  }

  @Get('search')
  async search(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
    @Query('sortBy') sortBy: 'createdAt',
  ) {
    try {
        if (['createdAt', 'title'].indexOf(sortBy) == -1){
            throw new BadRequestException('sortBy is invalid')
        }
        const result = await this.blogPostsService.search(query, +page, +pageSize, sortBy);

        return {
            data: result.data,
            page: result.page,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
        };
    } catch (error) {
      console.error('Error (search):', JSON.stringify(error));
      throw error;
    }
  }
  
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BlogPost> {
    try {
        if (!mongoose.Types.ObjectId.isValid(id)){
            throw new BadRequestException("Id is invalid")
        }

        const blogPost = await this.blogPostsService.findOne(id)
        if (!blogPost) {
            throw new NotFoundException("Blog entry not found");
        }
    
        return blogPost;
    } catch (error){
        console.error('Error (findOne):', JSON.stringify(error));
        throw error;
    }
  }

  //TODO: Consider using the endpoint findOne() first and then continue the logic
  @Delete(':id')
  async delete(@Param('id') id: string) {
    try {
        if (!id) {
            throw new BadRequestException("Id is required");
        }
        
        if (!mongoose.Types.ObjectId.isValid(id)){
            throw new BadRequestException("Id is invalid")
        }
        if (!(await this.blogPostsService.findOne(id))) {
            throw new NotFoundException("Blog entry not found");
        }
        await this.blogPostsService.delete(id);    
    } catch (error) {
        console.error('Error (delete):', JSON.stringify(error));
        throw error;
    }
  }
}
