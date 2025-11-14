import express from "express";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create", protect, (req, res) => {
  res.json({ message: "Post created successfully" });
});

export default router;
