import express from "express";
import {
  createPost,
  getFeedPosts,
  getUserPosts,
  likePost,
  commentPost,
  updatePost,
  replyToComment,
  editComment,
  deleteComment as deletePostComment, // Renamed to avoid partial conflict with controller export if any, though distinct export names used. Actually controller export name is deleteComment, safe to use aliases or just import.
  hideComment,
  deletePost,
  getPostById,
} from "../controllers/postController.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createPost);
router.get("/feed", protect, getFeedPosts);
router.get("/user/:userId", protect, getUserPosts);
router.get("/:id", protect, getPostById);
router.put("/:id/like", protect, likePost);
router.post("/:id/comment", protect, commentPost);
router.post("/:id/comments/:commentId/reply", protect, replyToComment);
router.put("/:id/comments/:commentId", protect, editComment);
router.delete("/:id/comments/:commentId", protect, deletePostComment);
router.put("/:id/comments/:commentId/hide", protect, hideComment);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
