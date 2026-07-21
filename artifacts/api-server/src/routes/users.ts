import { Router, type IRouter } from "express";
import { User } from "../models";

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
