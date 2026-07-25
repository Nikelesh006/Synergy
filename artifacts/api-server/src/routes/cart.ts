import { Router, type Request, type Response } from "express";
import { User } from "../models/index.js";

const router = Router();

// GET /api/cart - Get user's cart
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

    res.json({ cart: user.cart || [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch cart", details: String(error) });
  }
});

// POST /api/cart - Add item to cart
router.post("/", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { productId, quantity, name, price, image } = req.body;

    if (!productId || !quantity || !name || !price) {
      res.status(400).json({ error: "Missing required fields: productId, quantity, name, price" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Check if product already exists in cart
    const existingItemIndex = (user.cart || []).findIndex(
      (item: any) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity
      if (user.cart) {
        user.cart[existingItemIndex].quantity += quantity;
      }
    } else {
      // Add new item
      if (!user.cart) user.cart = [];
      user.cart.push({ productId, quantity, name, price, image });
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to cart", details: String(error) });
  }
});

// PUT /api/cart/:productId - Update cart item quantity
router.put("/:productId", async (req: Request, res: Response) => {
  try {
    const userId = req.headers["x-user-id"] as string;
    
    if (!userId) {
      res.status(401).json({ error: "User not authenticated" });
      return;
    }

    const { quantity } = req.body;
    const { productId } = req.params;

    if (!quantity || quantity < 0) {
      res.status(400).json({ error: "Invalid quantity" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    if (!user.cart) {
      res.status(404).json({ error: "Cart is empty" });
      return;
    }

    const itemIndex = user.cart.findIndex((item: any) => item.productId === productId);
    
    if (itemIndex === -1) {
      res.status(404).json({ error: "Item not found in cart" });
      return;
    }

    if (quantity === 0) {
      user.cart.splice(itemIndex, 1);
    } else {
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to update cart", details: String(error) });
  }
});

// DELETE /api/cart/:productId - Remove item from cart
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

    if (!user.cart) {
      res.status(404).json({ error: "Cart is empty" });
      return;
    }

    user.cart = user.cart.filter((item: any) => item.productId !== productId);
    await user.save();
    res.json({ cart: user.cart });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from cart", details: String(error) });
  }
});

// DELETE /api/cart - Clear entire cart
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

    user.cart = [];
    await user.save();
    res.json({ cart: [] });
  } catch (error) {
    res.status(500).json({ error: "Failed to clear cart", details: String(error) });
  }
});

export default router;
