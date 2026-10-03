import { Router, type IRouter, type Request, type Response } from "express";
import mongoose from "mongoose";
import { BlogPost } from "../models/BlogPost.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";

const router: IRouter = Router();

// Helper to ensure cover image is hosted on Cloudinary
const ensureCloudinaryCover = async (coverImage: string): Promise<string> => {
  if (typeof coverImage === "string" && coverImage.startsWith("data:image")) {
    try {
      const uploaded = await uploadToCloudinary(coverImage, { folder: "synergy/blogs" });
      return uploaded.secure_url;
    } catch (err) {
      console.warn("Auto-upload blog cover to Cloudinary failed:", err);
      return coverImage;
    }
  }
  return coverImage;
};

// POST /api/blogs - Create a new blog
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      slug, 
      author, 
      category, 
      status, 
      publishDate, 
      readTime, 
      coverImage, 
      excerpt, 
      content, 
      tags, 
      metaTitle, 
      metaDescription, 
      isFeatured 
    } = req.body ?? {};
    
    if (!title || !slug || !author || !category || !coverImage || !excerpt || !content) {
      res.status(400).json({ error: "Title, slug, author, category, coverImage, excerpt, and content are required" });
      return;
    }

    const processedCover = await ensureCloudinaryCover(coverImage);

    const blogData = { 
      title: String(title).trim(), 
      slug: String(slug).trim().toLowerCase(), 
      author: String(author).trim(), 
      category: String(category).trim(), 
      status: status || 'Draft',
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      coverImage: processedCover, 
      excerpt: String(excerpt).trim(), 
      content: String(content), 
      tags: Array.isArray(tags) ? tags : [],
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      isFeatured: Boolean(isFeatured)
    };

    if (!isDbConnected()) {
      const created = inMemoryStore.addBlog(blogData);
      res.status(201).json(created);
      return;
    }

    const blog = new BlogPost(blogData);
    await blog.save();
    
    res.status(201).json({ ...blog.toObject(), id: String(blog._id) });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create blog", details: error.message });
  }
});

// GET /api/blogs - Get all blogs (supports all=true for admin, category, and status filters)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { all, status, category, search } = req.query as Record<string, string>;

  if (!isDbConnected()) {
    let list = [...inMemoryStore.blogPosts];
    if (status) {
      list = list.filter((b) => b.status?.toLowerCase() === status.toLowerCase());
    } else if (all !== "true") {
      list = list.filter((b) => b.status === "Published");
    }
    if (category) {
      list = list.filter((b) => b.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) => b.title?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q));
    }
    res.json(list);
    return;
  }

  try {
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.status = status;
    } else if (all !== "true") {
      filter.status = "Published";
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const blogs = await BlogPost.find(filter).sort({ createdAt: -1 }).lean();
    if (!blogs || blogs.length === 0) {
      // Fallback to inMemoryStore if DB is empty
      if (all === "true") {
        res.json(inMemoryStore.blogPosts);
        return;
      }
      res.json(inMemoryStore.blogPosts.filter((b) => b.status === "Published"));
      return;
    }

    const mapped = blogs.map((b) => ({ ...b, id: String(b._id) }));
    res.json(mapped);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.json(inMemoryStore.blogPosts);
  }
});

// GET /api/blogs/:idOrSlug - Get a single blog by ID or slug
router.get("/:idOrSlug", async (req: Request, res: Response): Promise<void> => {
  const { idOrSlug } = req.params;
  const target = Array.isArray(idOrSlug) ? idOrSlug[0] : idOrSlug;

  if (!isDbConnected()) {
    const b = inMemoryStore.blogPosts.find((item) => item.slug === target || item.id === target || item._id === target);
    if (b) {
      res.json(b);
      return;
    }
    res.status(404).json({ error: "Blog not found" });
    return;
  }

  try {
    let blog = null;
    if (mongoose.isValidObjectId(target)) {
      blog = await BlogPost.findById(target).lean();
    }
    if (!blog) {
      blog = await BlogPost.findOne({ slug: target }).lean();
    }

    if (!blog) {
      const b = inMemoryStore.blogPosts.find((item) => item.slug === target || item.id === target || item._id === target);
      if (b) {
        res.json(b);
        return;
      }
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    const blogDoc = blog as Record<string, any>;
    res.json({ ...blogDoc, id: String(blogDoc._id) });
  } catch (error) {
    console.error("Error fetching single blog:", error);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});

// PUT /api/blogs/:id - Update a blog
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const body = req.body ?? {};

    if (body.coverImage) {
      body.coverImage = await ensureCloudinaryCover(body.coverImage);
    }

    if (!isDbConnected()) {
      const updated = inMemoryStore.updateBlog(id, body);
      if (!updated) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }
      res.json(updated);
      return;
    }

    const blog = await BlogPost.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.json({ ...blog.toObject(), id: String(blog._id) });
  } catch (error: any) {
    console.error("Error updating blog:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update blog", details: error.message });
  }
});

// DELETE /api/blogs/:id - Delete a blog
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!isDbConnected()) {
      const deleted = inMemoryStore.deleteBlog(id);
      if (!deleted) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }
      res.json({ message: "Blog deleted successfully" });
      return;
    }

    const blog = await BlogPost.findByIdAndDelete(id);
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
