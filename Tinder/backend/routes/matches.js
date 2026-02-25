import express from "express";
import {
  likeUser,
  passUser,
  unlikeUser,
} from "../controllers/matchController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/like", authMiddleware, likeUser);
router.post("/pass", authMiddleware, passUser);
router.post("/unlike", authMiddleware, unlikeUser);

export default router;
