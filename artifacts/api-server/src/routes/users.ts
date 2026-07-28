import { Router, type IRouter } from "express";
import { User, Order } from "../models";

const router: IRouter = Router();

// Create a new user
router.post("/", async (req, res): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      res.status(400).json({ error: "Name and email are required" });
      return;
    }

    const user = new User({ name, email });
    await user.save();
    
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Get user profile with stats
router.get("/profile/:userId", async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Calculate stats from orders
    const orders = await Order.find({ userId: req.params.userId });
    const totalOrdersValue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrdersCount = orders.length;
    const savedItemsCount = user.wishlist?.length || 0;

    // Update user stats if they've changed
    if (user.totalOrdersValue !== totalOrdersValue || 
        user.totalOrdersCount !== totalOrdersCount ||
        user.savedItemsCount !== savedItemsCount) {
      user.totalOrdersValue = totalOrdersValue;
      user.totalOrdersCount = totalOrdersCount;
      user.savedItemsCount = savedItemsCount;
      await user.save();
    }

    const profileData = {
      name: user.name,
      email: user.email,
      givenName: user.givenName,
      familyName: user.familyName,
      avatar: user.avatar,
      phone: user.phone,
      role: user.role,
      company: user.company,
      gstin: user.gstin,
      accountType: user.accountType,
      totalOrdersValue: user.totalOrdersValue || 0,
      savedItemsCount: user.savedItemsCount || 0,
      buyerRating: user.buyerRating || 0,
      totalOrdersCount: user.totalOrdersCount || 0,
      memberSince: user.createdAt,
      emailVerified: user.emailVerified,
      language: user.language || "en-IN",
      timezone: user.timezone || "Asia/Kolkata",
    };

    res.json({ success: true, profile: profileData });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put("/profile/:userId", async (req, res): Promise<void> => {
  try {
    const { name, phone, role, company, gstin } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        name, 
        phone, 
        role, 
        company, 
        gstin 
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json({ success: true, user });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

// Update account settings
router.put("/settings/:userId", async (req, res): Promise<void> => {
  try {
    const { language, timezone } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        language, 
        timezone 
      },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json({ success: true, settings: { language: user.language, timezone: user.timezone } });
  } catch (error: any) {
    console.error("Error updating account settings:", error);
    res.status(500).json({ error: "Failed to update account settings" });
  }
});

// Change password
router.put("/password/:userId", async (req, res): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: "Current password and new password are required" });
      return;
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    if (user.password !== currentPassword) {
      res.status(400).json({ error: "Current password is incorrect" });
      return;
    }

    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Failed to change password" });
  }
});

// Get all users
router.get("/", async (_req, res): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

// Update a user
router.put("/:id", async (req, res): Promise<void> => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json(user);
  } catch (error: any) {
    if (error.code === 11000) {
      res.status(400).json({ error: "Email already exists" });
      return;
    }
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

export default router;
