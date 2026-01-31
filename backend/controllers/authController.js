import User from "../models/User.js";
import Notification from "../models/Notification.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import sendEmail from "../utils/sendEmail.js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "profilePics" },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(fileBuffer);
  });
};

const pendingRegistrations = new Map();

// STEP 1: INIT REGISTER (Send OTP only)
export const registerInit = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    pendingRegistrations.set(email, {
      name,
      email,
      password,
      otp,
      expires: Date.now() + 10 * 60 * 1000,
    });



    await sendEmail(
      email,
      "SentiAware Registration OTP",
      `Your OTP is: ${otp}`
    );

    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// STEP 2: VERIFY OTP & CREATE USER
export const registerVerify = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = pendingRegistrations.get(email);

    if (!record)
      return res.status(400).json({ message: "No pending registration found" });

    if (record.expires < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (record.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Use stored data, NOT req.body
    const { name, password } = record;

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      profilePic = uploadResult.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // Create Welcome Notification
    await Notification.create({
      recipient: user._id,
      message: "Welcome to SentiAware! Complete your profile to get started.",
      type: "system",
    });

    pendingRegistrations.delete(email);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }


};



// @desc Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePic = "";
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      profilePic = uploadResult.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      profilePic,
    });

    // Create Welcome Notification
    await Notification.create({
      recipient: user._id,
      message: "Welcome to SentiAware! Complete your profile to get started.",
      type: "system",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login user
// @desc Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bio: user.bio || "",          // ✅ return bio
      location: user.location || "", // ✅ return location
      token: generateToken(user._id),
      createdAt: user.createdAt,
      friends: user.friends || [],

    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id; // assuming auth middleware adds req.user
    const { name, bio, location, address } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.location = location || user.location;
    user.address = address || user.address;

    // ✅ Proper profilePic update
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.buffer);
      user.profilePic = uploadResult.secure_url;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bio: updatedUser.bio,
      location: updatedUser.location,
      address: updatedUser.address,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};