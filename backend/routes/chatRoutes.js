import express from "express";
import protect from "../middleware/authMiddleware.js";
import { sendMessage, getMessages, getConversations, markMessagesAsRead, editMessage, deleteMessage, clearConversation } from "../controllers/chatController.js";

const router = express.Router();

router.get("/conversations", protect, getConversations);
router.get("/:id", protect, getMessages);
router.post("/send/:id", protect, sendMessage);
router.put("/mark-read/:id", protect, markMessagesAsRead);
router.put("/edit/:id", protect, editMessage);
router.delete("/delete/:id", protect, deleteMessage);
router.delete("/conversation/:id", protect, clearConversation);

export default router;
