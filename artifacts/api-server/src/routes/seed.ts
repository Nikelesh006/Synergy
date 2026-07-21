import { Router, type Request, type Response } from "express";
import { Product } from "../models/Product.js";
import { Category } from "../models/Category.js";
import { Brand } from "../models/Brand.js";
import { Blog, Tutorial } from "../models/index.js";
import { seedData } from "../data/seed.js";

const router = Router();

// POST /api/seed — one-time endpoint to load mock data into MongoDB
// Requires header: Authorization: Bearer synergy-seed-secret
router.post("/", async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  if (authHeader !== "Bearer synergy-seed-secret") {
    res.status(401).json({ error: "Unauthorized. Pass Authorization: Bearer synergy-seed-secret" });
    return;
  }

  try {
    const results: Record<string, unknown> = {};

    // Products
    if (seedData.products.length > 0) {
      await Product.deleteMany({});
      const inserted = await Product.insertMany(
        seedData.products,
        { ordered: false }
      );
      results["products"] = { inserted: inserted.length };
    }

    // Categories
    if (seedData.categories.length > 0) {
      await Category.deleteMany({});
      const inserted = await Category.insertMany(
        seedData.categories,
        { ordered: false }
      );
      results["categories"] = { inserted: inserted.length };
    }

    // Brands
    if (seedData.brands.length > 0) {
      await Brand.deleteMany({});
      const inserted = await Brand.insertMany(
        seedData.brands,
        { ordered: false }
      );
      results["brands"] = { inserted: inserted.length };
    }

    // Blog posts
    if (seedData.blogPosts.length > 0) {
      await Blog.deleteMany({});
      const mappedBlogs = seedData.blogPosts.map(bp => ({
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
        tags: []
      }));
      const inserted = await Blog.insertMany(
        mappedBlogs,
        { ordered: false }
      );
      results["blogPosts"] = { inserted: inserted.length };
    }

    // Tutorials
    if ((seedData as any).tutorials && (seedData as any).tutorials.length > 0) {
      await Tutorial.deleteMany({});
      const inserted = await Tutorial.insertMany(
        (seedData as any).tutorials,
        { ordered: false }
      );
      results["tutorials"] = { inserted: inserted.length };
    }

    res.json({ message: "Seed complete", results });
  } catch (err) {
    res.status(500).json({ error: "Seed failed", details: String(err) });
  }
});

export default router;
