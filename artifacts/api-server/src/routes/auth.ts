import { Router, type Request, type Response, type NextFunction } from "express";
import passport from "../config/passport.js";

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
