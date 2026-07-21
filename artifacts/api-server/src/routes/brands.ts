import { Router, type Request, type Response } from "express";
import { Brand } from "../models/Brand.js";

const router = Router();

// GET /api/brands
router.get("/", async (_req: Request, res: Response) => {
  try {
    const brands = await Brand.find().sort({ name: 1 }).lean();
    res.json(brands.map((b) => ({ ...b, id: String(b._id) })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands", details: String(err) });
  }
});

// POST /api/brands
router.post("/", async (req: Request, res: Response) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json({ ...brand.toObject(), id: String(brand._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create brand", details: String(err) });
  }
});

export default router;
