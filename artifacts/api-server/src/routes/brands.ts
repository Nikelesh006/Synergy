import { Router, type Request, type Response } from "express";
import { Brand } from "../models/Brand.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";

const router = Router();

// GET /api/brands
router.get("/", async (_req: Request, res: Response) => {
  if (!isDbConnected()) {
    return res.json(inMemoryStore.brands);
  }

  try {
    const brands = await Brand.find().sort({ name: 1 }).lean();
    if (!brands || brands.length === 0) {
      return res.json(inMemoryStore.brands);
    }
    res.json(brands.map((b) => ({ ...b, id: String(b._id) })));
  } catch (err) {
    res.json(inMemoryStore.brands);
  }
});

// POST /api/brands
router.post("/", async (req: Request, res: Response) => {
  try {
    if (!isDbConnected()) {
      const newBrand = { ...req.body, _id: `mem_brand_${Date.now()}`, id: `mem_brand_${Date.now()}` };
      inMemoryStore.brands.push(newBrand);
      return res.status(201).json(newBrand);
    }
    const brand = await Brand.create(req.body);
    res.status(201).json({ ...brand.toObject(), id: String(brand._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create brand", details: String(err) });
  }
});

export default router;

