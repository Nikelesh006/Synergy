import { Router, type Request, type Response } from "express";
import { BlogPost } from "../models/BlogPost.js";

const router = Router();

// GET /api/blog
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category, page = "1", limit = "12" } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (category) filter["category"] = category;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [posts, total] = await Promise.all([
      BlogPost.find(filter).sort({ date: -1 }).skip(skip).limit(limitNum).lean(),
      BlogPost.countDocuments(filter),
    ]);

    res.json({
      posts: posts.map((p) => ({ ...p, id: String(p._id) })),
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog posts", details: String(err) });
  }
});

// GET /api/blog/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const raw = await BlogPost.findOne({ slug: req.params["slug"] }).lean();
    if (!raw) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    const post = raw as Record<string, unknown>;
    res.json({ ...post, id: String(post["_id"]) });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blog post", details: String(err) });
  }
});

// POST /api/blog
router.post("/", async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.create(req.body);
    res.status(201).json({ ...post.toObject(), id: String(post._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create blog post", details: String(err) });
  }
});

// PUT /api/blog/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json({ ...post.toObject(), id: String(post._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to update blog post", details: String(err) });
  }
});

// DELETE /api/blog/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params["id"]);
    if (!post) {
      res.status(404).json({ error: "Blog post not found" });
      return;
    }
    res.json({ message: "Blog post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete blog post", details: String(err) });
  }
});

export default router;
