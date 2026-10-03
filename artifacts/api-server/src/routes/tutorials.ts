import { Router, type IRouter, type Request, type Response } from "express";
import mongoose from "mongoose";
import { Tutorial } from "../models/index.js";
import { isDbConnected } from "../lib/db.js";
import { inMemoryStore } from "../data/inMemoryStore.js";

const router: IRouter = Router();

// Create a new tutorial
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      slug, 
      youtubeUrl, 
      thumbnailUrl, 
      channelName, 
      instructor, 
      category, 
      level, 
      status, 
      duration, 
      publishDate, 
      shortDescription, 
      description, 
      tags, 
      resourcesUrl, 
      metaTitle, 
      metaDescription, 
      isFeatured 
    } = req.body ?? {};
    
    if (!title || !slug || !youtubeUrl || !channelName || !category || !duration || !shortDescription || !description) {
      res.status(400).json({ error: "Title, slug, youtubeUrl, channelName, category, duration, shortDescription, and description are required" });
      return;
    }

    const tutorialData = { 
      title: String(title).trim(), 
      slug: String(slug).trim().toLowerCase(), 
      youtubeUrl: String(youtubeUrl).trim(), 
      thumbnailUrl: thumbnailUrl || '',
      channelName: String(channelName).trim(), 
      instructor: instructor || channelName,
      category: String(category).trim(), 
      level: level || 'Beginner',
      status: status || 'Draft',
      duration: String(duration).trim(), 
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      shortDescription: String(shortDescription).trim(), 
      description: String(description), 
      tags: Array.isArray(tags) ? tags : [],
      resourcesUrl: resourcesUrl || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || shortDescription,
      isFeatured: Boolean(isFeatured)
    };

    if (!isDbConnected()) {
      const created = inMemoryStore.addTutorial(tutorialData);
      res.status(201).json(created);
      return;
    }

    const tutorial = new Tutorial(tutorialData);
    await tutorial.save();
    
    res.status(201).json({ ...tutorial.toObject(), id: String(tutorial._id) });
  } catch (error: any) {
    console.error("Error creating tutorial:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create tutorial", details: error.message });
  }
});

// Get all tutorials (supports all=true for admin, category, and status filters)
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const { all, status, category, search } = req.query as Record<string, string>;

  if (!isDbConnected()) {
    let list = [...inMemoryStore.tutorials];
    if (status) {
      list = list.filter((t) => t.status?.toLowerCase() === status.toLowerCase());
    } else if (all !== "true") {
      list = list.filter((t) => t.status === "Published");
    }
    if (category) {
      list = list.filter((t) => t.category?.toLowerCase() === category.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((t) => 
        t.title?.toLowerCase().includes(q) || 
        t.instructor?.toLowerCase().includes(q) || 
        t.channelName?.toLowerCase().includes(q)
      );
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
        { instructor: { $regex: search, $options: "i" } },
        { channelName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const tutorials = await Tutorial.find(filter).sort({ createdAt: -1 }).lean();
    if (!tutorials || tutorials.length === 0) {
      if (all === "true") {
        res.json(inMemoryStore.tutorials);
        return;
      }
      res.json(inMemoryStore.tutorials.filter((t) => t.status === "Published"));
      return;
    }

    const mapped = tutorials.map((t) => ({ ...t, id: String(t._id) }));
    res.json(mapped);
  } catch (error) {
    console.error("Error fetching tutorials:", error);
    res.json(inMemoryStore.tutorials);
  }
});

// Get a single tutorial by ID or slug
router.get("/:idOrSlug", async (req: Request, res: Response): Promise<void> => {
  const { idOrSlug } = req.params;
  const target = Array.isArray(idOrSlug) ? idOrSlug[0] : idOrSlug;

  if (!isDbConnected()) {
    const t = inMemoryStore.tutorials.find((item) => item.slug === target || item.id === target || item._id === target);
    if (t) {
      res.json(t);
      return;
    }
    res.status(404).json({ error: "Tutorial not found" });
    return;
  }

  try {
    let tutorial = null;
    if (mongoose.isValidObjectId(target)) {
      tutorial = await Tutorial.findById(target).lean();
    }
    if (!tutorial) {
      tutorial = await Tutorial.findOne({ slug: target }).lean();
    }

    if (!tutorial) {
      const t = inMemoryStore.tutorials.find((item) => item.slug === target || item.id === target || item._id === target);
      if (t) {
        res.json(t);
        return;
      }
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }

    res.json({ ...tutorial, id: String(tutorial._id) });
  } catch (error) {
    console.error("Error fetching single tutorial:", error);
    res.status(500).json({ error: "Failed to fetch tutorial" });
  }
});

// Update a tutorial
router.put("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const body = req.body ?? {};

    if (!isDbConnected()) {
      const updated = inMemoryStore.updateTutorial(id, body);
      if (!updated) {
        res.status(404).json({ error: "Tutorial not found" });
        return;
      }
      res.json(updated);
      return;
    }

    const tutorial = await Tutorial.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }

    res.json({ ...tutorial.toObject(), id: String(tutorial._id) });
  } catch (error: any) {
    console.error("Error updating tutorial:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update tutorial", details: error.message });
  }
});

// Delete a tutorial
router.delete("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!isDbConnected()) {
      const deleted = inMemoryStore.deleteTutorial(id);
      if (!deleted) {
        res.status(404).json({ error: "Tutorial not found" });
        return;
      }
      res.json({ message: "Tutorial deleted successfully" });
      return;
    }

    const tutorial = await Tutorial.findByIdAndDelete(id);
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }

    res.json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    console.error("Error deleting tutorial:", error);
    res.status(500).json({ error: "Failed to delete tutorial" });
  }
});

export default router;
