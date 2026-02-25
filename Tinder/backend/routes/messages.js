import express from "express";
import {
  sendMessage,
  getConversation,
  getAllConversations,
  deleteMessage,
} from "../controllers/messageController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getAllConversations);
router.get("/:otherUserId", authMiddleware, getConversation);
router.delete("/:messageId", authMiddleware, deleteMessage);

export default router;
