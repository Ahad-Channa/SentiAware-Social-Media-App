// import express from "express";
// import { registerUser, loginUser, updateUserProfile } from "../controllers/authController.js";
// import upload from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// router.post("/register", upload.single("profilePic"), registerUser);
// router.post("/login", loginUser);
// router.put("/update", authMiddleware, upload.single("profilePic"), updateUserProfile);

// export default router;
import express from "express";
import { registerUser, loginUser, updateUserProfile } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js"; // <--- add this
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerUser);
router.post("/login", loginUser);
router.put("/update", authMiddleware, upload.single("profilePic"), updateUserProfile);

export default router;
