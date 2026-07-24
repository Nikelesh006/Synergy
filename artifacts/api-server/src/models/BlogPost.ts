import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  status: string;
  publishDate: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  metaTitle: string;
  metaDescription: string;
  isFeatured: boolean;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    category: { type: String, required: true },
    status: { type: String, default: "Draft" },
    publishDate: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    coverImage: { type: String, required: true },
    tags: [{ type: String }],
    metaTitle: { type: String },
    metaDescription: { type: String },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });
blogPostSchema.index({ status: 1 });
blogPostSchema.index({ isFeatured: 1 });

export const BlogPost = mongoose.models["BlogPost"] ?? mongoose.model<IBlogPost>("BlogPost", blogPostSchema);
