import express from "express";
import {
  getSwipeUsers,
  getMatches,
  updateProfile,
  getUserProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/swipe", authMiddleware, getSwipeUsers);
router.get("/matches", authMiddleware, getMatches);
router.put("/profile", authMiddleware, updateProfile);
router.get("/:userId", authMiddleware, getUserProfile);

export default router;
