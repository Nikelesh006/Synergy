import { Router, type Request, type Response } from "express";
import { User } from "../models/index.js";

const router = Router();

// GET /api/wishlist - Get user's wishlist
router.get("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist", details: String(error) });
  }
});

// POST /api/wishlist - Add item to wishlist
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { productId, name, price, image } = req.body;

    if (!productId || !name || !price) {
      res.status(400).json({ error: "Missing required fields: productId, name, price" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if product already exists in wishlist
    const existingItem = (user.wishlist || []).find(
      (item: any) => item.productId === productId
    );

    if (existingItem) {
      res.status(400).json({ error: "Item already in wishlist" });
      return;
    }

    // Add new item
    if (!user.wishlist) user.wishlist = [];
    user.wishlist.push({ productId, name, price, image });

    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist", details: String(error) });
  }
});

// DELETE /api/wishlist/:productId - Remove item from wishlist
router.delete("/:productId", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.wishlist) {
      res.status(404).json({ error: "Wishlist is empty" });
      return;
    }

    user.wishlist = user.wishlist.filter((item: any) => item.productId !== productId);
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist", details: String(error) });
  }
});

// DELETE /api/wishlist - Clear entire wishlist
router.delete("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    user.wishlist = [];
    await user.save();
    res.json({ wishlist: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear wishlist", details: String(error) });
  }
});

export default router;
