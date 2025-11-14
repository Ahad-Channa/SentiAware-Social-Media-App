import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Please enter your name"] },
    email: { type: String, required: [true, "Please enter your email"], unique: true },
    password: { type: String, required: [true, "Please enter a password"] },
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },       // new optional field
    location: { type: String, default: "" },  // new optional field
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
