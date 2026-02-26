import User from "../models/User.js";
import OTP from "../models/OTP.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendOTPEmail } from "../utils/emailService.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password, age, gender, interestedIn, bio, otp } = req.body;

    // Validation
    if (!name || !email || !password || !age || !gender || !interestedIn || !otp) {
      return res.status(400).json({
        message:
          "Please provide all required fields including the OTP code.",
      });
    }

    // Verify OTP first
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        // Delete the old unverified user so they can complete registration
        await User.deleteOne({ email });
      }
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      age,
      gender,
      interestedIn,
      bio: bio || "",
      isVerified: true,
    });

    await user.save();

    // Delete OTP after successful registration
    await OTP.deleteMany({ email });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Your account is not verified. Please register again to verify your email." });
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json(user.toJSON());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("OTP Request for:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      console.log("OTP Failed: User already exists -", email);
      return res.status(400).json({ message: "An account with this email already exists. Please login instead." });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Upsert OTP
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    const emailSent = await sendOTPEmail(email, otp);

    if (emailSent) {
      res.status(200).json({ message: "OTP sent successfully" });
    } else {
      // This part should theoretically not be hit due to fallback in emailService.js
      res.status(500).json({ message: "System failure sending OTP. Please contact support." });
    }
  } catch (error) {
    console.error("CRITICAL OTP ERROR:", error);
    res.status(500).json({ message: "Server error during OTP request: " + error.message });
  }
};

// Verify OTP (helper for frontend if needed)
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Google Login/Register
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "ID Token is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name,
        email,
        password: Math.random().toString(36).slice(-10), // Random password for OAuth users
        age: 18, // Default age, user can update later
        gender: "other",
        interestedIn: "both",
        profilePictureUrl: picture,
        isDiscoverable: true,
        isVerified: true,
      });
      await user.save();
    } else if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    res.status(200).json({
      message: "Google login successful",
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ message: "Google authentication failed: " + error.message });
  }
};
