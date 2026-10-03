import { Router, type Request, type Response } from "express";
import { Category } from "../models/Category.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";

const router = Router();

// GET /api/categories
router.get("/", async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(inMemoryStore.categories);
  }

  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    if (!categories || categories.length === 0) {
      return res.json(inMemoryStore.categories);
    }
    res.json(categories.map((c) => ({ ...c, id: String(c._id) })));
  } catch (err) {
    res.json(inMemoryStore.categories);
  }
});

// POST /api/categories
router.post("/", async (req: Request, res: Response) => {
  try {
    if (!isDbConnected()) {
      const newCat = { ...req.body, _id: `mem_cat_${Date.now()}`, id: `mem_cat_${Date.now()}` };
      inMemoryStore.categories.push(newCat);
      return res.status(201).json(newCat);
    }
    const category = await Category.create(req.body);
    res.status(201).json({ ...category.toObject(), id: String(category._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create category", details: String(err) });
  }
});

export default router;

