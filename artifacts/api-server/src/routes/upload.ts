import { Router, type Request, type Response } from "express";
import { uploadToCloudinary, isCloudinaryConfigured } from "../lib/cloudinary.js";

const router = Router();

// GET /api/upload/status
router.get("/status", (_req: Request, res: Response): void => {
  res.json({
    configured: isCloudinaryConfigured(),
  });
});

// POST /api/upload
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, images, folder = "synergy" } = req.body ?? {};

    if (!isCloudinaryConfigured()) {
      res.status(503).json({
        error: "Cloudinary is not configured.",
        details: "Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to artifacts/api-server/.env.",
      });
      return;
    }

    // Handle batch upload
    if (Array.isArray(images) && images.length > 0) {
      const results = await Promise.all(
        images.map(async (img: string) => {
          if (typeof img !== "string" || !img.trim()) return null;
          const uploaded = await uploadToCloudinary(img, { folder });
          return {
            url: uploaded.secure_url,
            publicId: uploaded.public_id,
            width: uploaded.width,
            height: uploaded.height,
            format: uploaded.format,
          };
        })
      );

      const validResults = results.filter(Boolean);
      res.json({
        success: true,
        count: validResults.length,
        items: validResults,
        urls: validResults.map((item) => item?.url),
      });
      return;
    }

    // Handle single upload
    if (typeof image === "string" && image.trim()) {
      const result = await uploadToCloudinary(image, { folder });
      res.json({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
      });
      return;
    }

    res.status(400).json({
      error: "No image provided. Please supply an 'image' or 'images' string (base64 Data URL or remote URL).",
    });
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    res.status(500).json({
      error: "Image upload failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
});

export default router;
