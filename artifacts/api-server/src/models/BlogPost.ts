import mongoose, { Schema, type Document } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  image: string;
  youtubeUrl?: string;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, default: "" },
    content: { type: String },
    author: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    image: { type: String, default: "" },
    youtubeUrl: { type: String },
  },
  { timestamps: true },
);

blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ category: 1 });

export const BlogPost = mongoose.models["BlogPost"] ?? mongoose.model<IBlogPost>("BlogPost", blogPostSchema);
