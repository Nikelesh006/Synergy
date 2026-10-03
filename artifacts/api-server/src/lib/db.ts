import mongoose from "mongoose";
import dns from "node:dns";
import { logger } from "./logger.js";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Blog, Tutorial } from "../models/index.js";
import { seedData } from "../data/seed.js";

let isConnected = false;

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}

// Try public DNS servers to resolve MongoDB Atlas SRV records on Windows
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);
  } catch {
    // Ignore DNS configuration failure
  }
}

async function autoSeedIfEmpty() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0 && seedData.products.length > 0) {
      logger.info("Database is empty. Automatically seeding initial products and categories...");
      await Product.insertMany(seedData.products, { ordered: false });
      if (seedData.categories.length > 0) {
        await Category.insertMany(seedData.categories, { ordered: false });
      }
      if (seedData.brands.length > 0) {
        await Brand.insertMany(seedData.brands, { ordered: false });
      }
      if (seedData.blogPosts.length > 0) {
        const mappedBlogs = seedData.blogPosts.map((bp) => ({
          title: bp.title,
          slug: bp.slug,
          excerpt: bp.excerpt,
          content: bp.content || "Detailed content...",
          author: bp.author,
          category: bp.category,
          readTime: bp.readTime,
          coverImage: bp.image,
          publishDate: bp.date,
          status: "Published",
          metaTitle: bp.title,
          metaDescription: bp.excerpt,
          isFeatured: true,
          tags: [],
        }));
        await Blog.insertMany(mappedBlogs, { ordered: false });
      }
      if ((seedData as any).tutorials && (seedData as any).tutorials.length > 0) {
        await Tutorial.insertMany((seedData as any).tutorials, { ordered: false });
      }
      logger.info("Auto-seeding completed successfully.");
    }
  } catch (seedErr) {
    logger.warn({ seedErr }, "Auto-seeding could not complete cleanly, will continue normally.");
  }
}

export async function connectDB(): Promise<void> {
  if (isConnected && mongoose.connection.readyState === 1) return;

  const uri = process.env["MONGODB_URL"];
  if (!uri) {
    logger.warn("MONGODB_URL environment variable is not defined. Running in in-memory fallback mode.");
    isConnected = false;
    mongoose.set("bufferCommands", false);
    return;
  }

  try {
    await mongoose.connect(uri, {
      dbName: "synergy",
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000,
    });
    isConnected = true;
    logger.info("MongoDB connected successfully");
    await autoSeedIfEmpty();
  } catch (err: any) {
    isConnected = false;
    mongoose.set("bufferCommands", false);
    logger.warn(
      { message: err?.message || String(err) },
      "Could not connect to MongoDB Atlas. API server will operate seamlessly using resilient in-memory data store."
    );
  }
}

export { mongoose };

