import mongoose, { Schema, type Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  productCount: number;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Category = mongoose.models["Category"] ?? mongoose.model<ICategory>("Category", categorySchema);
