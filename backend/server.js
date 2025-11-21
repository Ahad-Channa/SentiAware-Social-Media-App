import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import protect from "./middleware/authMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import friendRoutes from "./routes/friendRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SentiAware API is running...");
});

import authRoutes from "./routes/authRoutes.js";
app.use("/api/auth", authRoutes);

app.get("/api/test", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

app.use("/api/users", userRoutes);
app.use("/api/friends", friendRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
