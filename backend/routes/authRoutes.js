import express from "express";
import { registerUser, loginUser, updateUserProfile, registerInit, registerVerify  } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // <--- add this
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register-init", registerInit);
router.post("/register-verify", upload.single("profilePic"), registerVerify);
router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.put("/update", authMiddleware, upload.single("profilePic"), updateUserProfile);

export default router;
