import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogPostsModule } from './blog-posts/blog-posts.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/test'),
    BlogPostsModule,
  ],
})
export class AppModule {}
 