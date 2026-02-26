import express from "express";
import { register, login, getCurrentUser, sendOTP, verifyOTP, googleLogin } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getCurrentUser);

// OTP routes
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/google", googleLogin);

export default router;
