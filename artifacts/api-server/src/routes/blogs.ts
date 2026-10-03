import { Router, type IRouter } from "express";
import { BlogPost } from "../models/BlogPost.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";

const router: IRouter = Router();


// Create a new blog
router.post("/", async (req, res): Promise<void> => {
  try {
    console.log("Blog creation request body:", JSON.stringify(req.body, null, 2));
    
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
    } = req.body;
    
    if (!title || !slug || !author || !category || !coverImage || !excerpt || !content) {
      console.log("Missing required fields:", { title, slug, author, category, coverImage, excerpt, content });
      res.status(400).json({ error: "Title, slug, author, category, coverImage, excerpt, and content are required" });
      return;
    }

    const blog = new BlogPost({ 
      title, 
      slug, 
      author, 
      category, 
      status: status || 'Draft',
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      readTime: readTime || '5 min read',
      coverImage, 
      excerpt, 
      content, 
      tags: tags || [],
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || excerpt,
      isFeatured: isFeatured || false
    });
    
    console.log("Blog object to save:", JSON.stringify(blog.toObject(), null, 2));
    await blog.save();
    console.log("Blog saved successfully:", blog._id);
    
    res.status(201).json(blog);
  } catch (error: any) {
    console.error("Error creating blog:", error);
    if (error.code === 11000) {
      console.log("Duplicate slug error:", error.keyPattern);
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    console.log("Validation error:", error.errors);
    res.status(500).json({ error: "Failed to create blog", details: error.message });
  }
});

// Get all blogs
router.get("/", async (_req, res): Promise<void> => {
  if (!isDbConnected()) {
    return res.json(inMemoryStore.blogPosts);
  }
  try {
    const blogs = await BlogPost.find({ status: 'Published' });
    if (!blogs || blogs.length === 0) {
      return res.json(inMemoryStore.blogPosts);
    }
    res.json(blogs);
  } catch (error) {
    res.json(inMemoryStore.blogPosts);
  }
});

// Get a single blog by slug
router.get("/:slug", async (req, res): Promise<void> => {
  const slug = req.params.slug;
  if (!isDbConnected()) {
    const b = inMemoryStore.blogPosts.find((item) => item.slug === slug || item.id === slug);
    if (b) return res.json(b);
    return res.status(404).json({ error: "Blog not found" });
  }
  try {
    const blog = await BlogPost.findOne({ slug });
    if (!blog) {
      const b = inMemoryStore.blogPosts.find((item) => item.slug === slug || item.id === slug);
      if (b) return res.json(b);
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    res.json(blog);
  } catch (error) {
    const b = inMemoryStore.blogPosts.find((item) => item.slug === slug || item.id === slug);
    if (b) return res.json(b);
    res.status(500).json({ error: "Failed to fetch blog" });
  }
});


// Update a blog
router.put("/:id", async (req, res): Promise<void> => {
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
    } = req.body;
    
    const blog = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { 
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
      },
      { new: true, runValidators: true }
    );
    
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    
    res.json(blog);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete a blog
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const blog = await BlogPost.findByIdAndDelete(req.params.id);
    
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog" });
  }
});

export default router;
