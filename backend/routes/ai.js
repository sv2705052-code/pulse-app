import express from "express";
import { analyzeMatch } from "../controllers/aiController.js";
// Assume we have an auth middleware, need to check its path
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/analyze/:matchId", authMiddleware, analyzeMatch);

export default router;
