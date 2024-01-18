import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlogPostDocument = HydratedDocument<BlogPost>;

@Schema()
export class BlogPost {
    @Prop()
    title: string;

    @Prop()
    content: string;

    @Prop()
    author: string;

    @Prop()
    createdAt: Date;
}

export const BlogPostSchema = SchemaFactory.createForClass(BlogPost);
