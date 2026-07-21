import mongoose, { Schema, type Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  slug: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  features: string[];
  applications: string[];
  images: string[];
  price: number;
  compareAtPrice?: number;
  currency: string;
  stock: number;
  inStock: boolean;
  minOrderQty: number;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNewArrival: boolean;
  isBestSeller: boolean;
  warrantyInfo: string;
  shippingInfo: string;
  mpn?: string;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    sku: { type: String, required: true, unique: true, trim: true },
    brand: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    specifications: { type: Map, of: String, default: {} },
    features: [{ type: String }],
    applications: [{ type: String }],
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number },
    currency: { type: String, default: "INR" },
    stock: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    minOrderQty: { type: Number, default: 1 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    warrantyInfo: { type: String, default: "" },
    shippingInfo: { type: String, default: "" },
    mpn: { type: String, default: "" },
  },
  { timestamps: true },
);

// Text search index for product name and description
productSchema.index({ name: "text", description: "text", shortDescription: "text" });
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ isBestSeller: 1 });

export const Product = mongoose.models["Product"] ?? mongoose.model<IProduct>("Product", productSchema);
