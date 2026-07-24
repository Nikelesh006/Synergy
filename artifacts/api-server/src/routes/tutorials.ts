import { Router, type IRouter } from "express";
import { Tutorial } from "../models";

const router: IRouter = Router();

// Create a new tutorial
router.post("/", async (req, res): Promise<void> => {
  try {
    console.log("Tutorial creation request body:", JSON.stringify(req.body, null, 2));
    
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
    } = req.body;
    
    if (!title || !slug || !youtubeUrl || !channelName || !category || !duration || !shortDescription || !description) {
      console.log("Missing required fields:", { title, slug, youtubeUrl, channelName, category, duration, shortDescription, description });
      res.status(400).json({ error: "Title, slug, youtubeUrl, channelName, category, duration, shortDescription, and description are required" });
      return;
    }

    const tutorial = new Tutorial({ 
      title, 
      slug, 
      youtubeUrl, 
      thumbnailUrl: thumbnailUrl || '',
      channelName, 
      instructor: instructor || channelName,
      category, 
      level: level || 'Beginner',
      status: status || 'Draft',
      duration, 
      publishDate: publishDate || new Date().toISOString().split('T')[0],
      shortDescription, 
      description, 
      tags: tags || [],
      resourcesUrl: resourcesUrl || '',
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || shortDescription,
      isFeatured: isFeatured || false
    });
    
    console.log("Tutorial object to save:", JSON.stringify(tutorial.toObject(), null, 2));
    await tutorial.save();
    console.log("Tutorial saved successfully:", tutorial._id);
    
    res.status(201).json(tutorial);
  } catch (error: any) {
    console.error("Error creating tutorial:", error);
    if (error.code === 11000) {
      console.log("Duplicate slug error:", error.keyPattern);
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    console.log("Validation error:", error.errors);
    res.status(500).json({ error: "Failed to create tutorial", details: error.message });
  }
});

// Get all tutorials
router.get("/", async (_req, res): Promise<void> => {
  try {
    const tutorials = await Tutorial.find({ status: 'Published' });
    res.json(tutorials);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutorials" });
  }
});

// Get a single tutorial by slug
router.get("/:slug", async (req, res): Promise<void> => {
  try {
    const tutorial = await Tutorial.findOne({ slug: req.params.slug });
    
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }
    
    res.json(tutorial);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tutorial" });
  }
});

// Update a tutorial
router.put("/:id", async (req, res): Promise<void> => {
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
    } = req.body;
    
    const tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      { 
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
      },
      { new: true, runValidators: true }
    );
    
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }
    
    res.json(tutorial);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Slug already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update tutorial" });
  }
});

// Delete a tutorial
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    
    if (!tutorial) {
      res.status(404).json({ error: "Tutorial not found" });
      return;
    }
    
    res.json({ message: "Tutorial deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete tutorial" });
  }
});

export default router;
