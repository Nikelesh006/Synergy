import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/index.js";

interface GoogleProfile {
  id: string;
  displayName: string;
  name?: {
    givenName: string;
    familyName: string;
  };
  emails?: Array<{ value: string; verified: boolean }>;
  photos?: Array<{ value: string }>;
  provider?: string;
}

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile: GoogleProfile, done) => {
      try {
        console.log("Google OAuth callback received profile:", JSON.stringify(profile, null, 2));
        
        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error("No email found in Google profile");
          return done(new Error("No email found in Google profile"), undefined);
        }

        console.log("Looking for user with email:", email);
        let user = await User.findOne({ email });
        console.log("Existing user found:", user ? "Yes" : "No");

        if (!user) {
          console.log("Creating new user with data:", {
            email,
            name: profile.displayName,
            givenName: profile.name?.givenName,
            familyName: profile.name?.familyName,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            emailVerified: profile.emails?.[0]?.verified || true,
            provider: "google",
          });
          
          user = await User.create({
            email,
            name: profile.displayName,
            givenName: profile.name?.givenName,
            familyName: profile.name?.familyName,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            emailVerified: profile.emails?.[0]?.verified || true,
            provider: "google",
          });
          console.log("User created successfully:", user._id);
        } else {
          console.log("Updating existing user with Google info");
          // Update existing user with Google info if not already linked
          if (!user.googleId) {
            user.googleId = profile.id;
            user.avatar = profile.photos?.[0]?.value || user.avatar;
            user.givenName = profile.name?.givenName || user.givenName;
            user.familyName = profile.name?.familyName || user.familyName;
            user.provider = "google";
            await user.save();
            console.log("User updated successfully");
          } else {
            console.log("User already has Google ID, skipping update");
          }
        }

        console.log("Returning user to passport:", user._id);
        return done(null, user);
      } catch (error) {
        console.error("Error in Google OAuth strategy:", error);
        return done(error, undefined);
      }
    }
  )
);

export default passport;
