import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "../config/passport.js";
import { User } from "../models/index.js";
import bcrypt from "bcryptjs";

const router = Router();

// Google OAuth login route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google OAuth callback route
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:5173/login?error=oauth_failed" }),
  (req: Request, res: Response) => {
    // Successful authentication - redirect back to frontend with complete user data
    const user = req.user as any;
    // Redirect to frontend with complete user info in query params
    const userData = {
      userId: user._id,
      email: user.email,
      name: user.name,
      givenName: user.givenName,
      familyName: user.familyName,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
    };
    // Encode user data as JSON in URL
    const encodedUser = encodeURIComponent(JSON.stringify(userData));
    res.redirect(`http://localhost:5173?auth=success&user=${encodedUser}`);
  }
);

// Sign up route
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      res.status(400).json({ error: "Name, email, and password are required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name: fullName,
      email,
      phone: phone || "",
      password: hashedPassword,
      provider: "local",
      emailVerified: false,
    });

    // Return user data (without password)
    const userData = {
      userId: user._id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      emailVerified: user.emailVerified,
    };

    res.status(201).json({ success: true, user: userData });
  } catch (error) {
    console.error("Sign up error:", error);
    res.status(500).json({ error: "Failed to create account" });
  }
});

// Sign in route
router.post("/signin", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Check if user has password (local account)
    if (!user.password) {
      res.status(401).json({ error: "Please sign in with Google" });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    // Return user data
    const userData = {
      userId: user._id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      provider: user.provider,
      emailVerified: user.emailVerified,
    };

    res.json({ success: true, user: userData });
  } catch (error) {
    console.error("Sign in error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// Get current user session
router.get("/me", (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    const user = req.user as any;
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } else {
    res.status(401).json({ success: false, message: "Not authenticated" });
  }
});

// Logout route
router.post("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err: any) => {
    if (err) {
      return next(err);
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

export default router;
