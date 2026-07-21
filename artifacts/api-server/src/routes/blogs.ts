import { Router, type IRouter } from "express";
import { Blog } from "../models";

const router: IRouter = Router();

// Create a new blog
router.post("/", async (req, res): Promise<void> => {
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
    
    if (!title || !slug || !author || !category || !coverImage || !excerpt || !content) {
      res.status(400).json({ error: "Title, slug, author, category, coverImage, excerpt, and content are required" });
      return;
    }

    const blog = new Blog({ 
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
    await blog.save();
    
    res.status(201).json(blog);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create blog" });
  }
});

// Get all blogs
router.get("/", async (_req, res): Promise<void> => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// Get a single blog by ID
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      res.status(404).json({ error: "Blog not found" });
      return;
    }
    
    res.json(blog);
  } catch (error) {
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
    
    const blog = await Blog.findByIdAndUpdate(
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
    const blog = await Blog.findByIdAndDelete(req.params.id);
    
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
