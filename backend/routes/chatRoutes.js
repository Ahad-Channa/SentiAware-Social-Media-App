import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, getConversations } from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);

export default router;
