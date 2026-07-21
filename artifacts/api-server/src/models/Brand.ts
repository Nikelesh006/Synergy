import mongoose, { Schema, type Document } from "mongoose";

export interface IBrand extends Document {
  name: string;
  slug: string;
  description: string;
  logo?: string;
  productCount: number;
}

const brandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    logo: { type: String },
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Brand = mongoose.models["Brand"] ?? mongoose.model<IBrand>("Brand", brandSchema);
