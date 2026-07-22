import { Router, type Request, type Response } from "express";
import { Product } from "../models/Product.js";

const router = Router();

const allowedCategories = new Set([
  "IoT",
  "AI",
  "Embedded Systems Boards",
  "Robotics",
  "Sensors and Instrumentation (MR3461)",
]);

const slugify = (value: string) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const stringList = (value: unknown) => Array.isArray(value)
  ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
  : [];

const parseSpecifications = (value: unknown): Record<string, string> => {
  if (typeof value !== "string") return {};
  return value.split(",").reduce<Record<string, string>>((specifications, specification) => {
    const separator = specification.indexOf(":");
    if (separator === -1) return specifications;
    const key = specification.slice(0, separator).trim();
    const specValue = specification.slice(separator + 1).trim();
    if (key && specValue) specifications[key] = specValue;
    return specifications;
  }, {});
};

const nextAvailableSlug = async (baseSlug: string) => {
  let slug = baseSlug;
  let suffix = 2;
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
  return slug;
};

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
    const body = req.body as Record<string, unknown>;
    const requiredFields = ["name", "sku", "brand", "category", "subcategory"] as const;
    const values = Object.fromEntries(
      requiredFields.map((field) => [field, typeof body[field] === "string" ? body[field].trim() : ""]),
    ) as Record<(typeof requiredFields)[number], string>;
    const missingFields = requiredFields.filter((field) => !values[field]);

    if (missingFields.length > 0) {
      res.status(400).json({ error: `Missing required fields: ${missingFields.join(", ")}` });
      return;
    }
    if (!allowedCategories.has(values.category)) {
      res.status(400).json({ error: "Select a category from the existing category list." });
      return;
    }

    const price = Number(body["price"]);
    const stock = Number(body["stock"] ?? 0);
    const compareAtPrice = body["compareAtPrice"] === undefined ? undefined : Number(body["compareAtPrice"]);
    const images = stringList(body["images"]);
    if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(stock) || stock < 0) {
      res.status(400).json({ error: "Price must be greater than zero and stock must be a whole number of zero or more." });
      return;
    }
    if (compareAtPrice !== undefined && (!Number.isFinite(compareAtPrice) || compareAtPrice <= price)) {
      res.status(400).json({ error: "Offer price must be lower than the price." });
      return;
    }
    if (images.length === 0) {
      res.status(400).json({ error: "At least one product image is required." });
      return;
    }

    const baseSlug = slugify(values.name);
    if (!baseSlug) {
      res.status(400).json({ error: "Product name must contain letters or numbers." });
      return;
    }

    const productData = {
      ...body,
      ...values,
      slug: await nextAvailableSlug(baseSlug),
      price,
      stock,
      compareAtPrice,
      specifications: parseSpecifications(body["specifications"]),
      features: stringList(body["features"]),
      applications: stringList(body["applications"]),
      images,
      inStock: body["inStock"] === true && stock > 0,
    };
    const product = await Product.create(productData);
    res.status(201).json({ ...product.toObject(), id: String(product._id) });
  } catch (err) {
    console.error("Error creating product:", err);
    if (typeof err === "object" && err && "code" in err && err.code === 11000) {
      res.status(409).json({ error: "A product with this SKU already exists." });
      return;
    }
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
