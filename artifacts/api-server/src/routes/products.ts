import { Router, type Request, type Response } from "express";
import { Product } from "../models/Product.js";

const router = Router();

// GET /api/products
router.get("/", async (req: Request, res: Response) => {
  try {
    const {
      category,
      subcategory,
      brand,
      search,
      featured,
      newArrival,
      bestSeller,
      minPrice,
      maxPrice,
      inStock,
      page = "1",
      limit = "24",
      sort = "relevance",
    } = req.query as Record<string, string>;

    const filter: Record<string, unknown> = {};

    if (category) filter["category"] = category;
    if (subcategory) filter["subcategory"] = subcategory;
    if (brand) filter["brand"] = brand;
    if (featured === "true") filter["isFeatured"] = true;
    if (newArrival === "true") filter["isNewArrival"] = true;
    if (bestSeller === "true") filter["isBestSeller"] = true;
    if (inStock === "true") filter["inStock"] = true;

    if (minPrice || maxPrice) {
      filter["price"] = {};
      if (minPrice) (filter["price"] as Record<string, number>)["$gte"] = Number(minPrice);
      if (maxPrice) (filter["price"] as Record<string, number>)["$lte"] = Number(maxPrice);
    }

    if (search) {
      filter["$text"] = { $search: search };
    }

    let sortObj: Record<string, 1 | -1> = {};
    switch (sort) {
      case "price-asc": sortObj = { price: 1 }; break;
      case "price-desc": sortObj = { price: -1 }; break;
      case "newest": sortObj = { createdAt: -1 }; break;
      case "bestselling": sortObj = { isBestSeller: -1, reviewCount: -1 }; break;
      default: sortObj = { isFeatured: -1, isBestSeller: -1, createdAt: -1 };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortObj).skip(skip).limit(limitNum).lean(),
      Product.countDocuments(filter),
    ]);

    const mapped = products.map((p) => ({
      ...p,
      id: String(p._id),
      specifications: p.specifications instanceof Map
        ? Object.fromEntries(p.specifications as Map<string, string>)
        : p.specifications,
    }));

    res.json({
      products: mapped,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products", details: String(err) });
  }
});

// GET /api/products/:slug
router.get("/:slug", async (req: Request, res: Response) => {
  try {
    const raw = await Product.findOne({ slug: req.params["slug"] }).lean();
    if (!raw) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const product = raw as Record<string, unknown>;
    res.json({
      ...product,
      id: String(product["_id"]),
      specifications: product["specifications"] instanceof Map
        ? Object.fromEntries(product["specifications"] as Map<string, string>)
        : product["specifications"],
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product", details: String(err) });
  }
});

// POST /api/products
router.post("/", async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ ...product.toObject(), id: String(product._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to create product", details: String(err) });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params["id"], req.body, { new: true });
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ ...product.toObject(), id: String(product._id) });
  } catch (err) {
    res.status(400).json({ error: "Failed to update product", details: String(err) });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params["id"]);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product", details: String(err) });
  }
});

// DELETE /api/products (delete all products)
router.delete("/", async (req: Request, res: Response) => {
  try {
    const result = await Product.deleteMany({});
    res.json({ message: `Deleted ${result.deletedCount} products` });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete products", details: String(err) });
  }
});

export default router;
