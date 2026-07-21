import { Router, type Request, type Response } from "express";
import { Category } from "../models/Category.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories.map((c) => ({ ...c, id: String(c._id) })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories", details: String(err) });
  }
});

// POST /api/categories
router.post("/", async (req: Request, res: Response) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ ...category.toObject(), id: String(category._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create category", details: String(err) });
  }
});

export default router;
