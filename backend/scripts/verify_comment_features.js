import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";
import Post from "../models/Post.js";
import {
    commentPost,
    replyToComment,
    editComment,
    hideComment,
    deleteComment
} from "../controllers/postController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Mock Request/Response for Controller Testing
const mockReq = (body = {}, params = {}, user = {}) => ({
    body,
    params,
    user
});

const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

import fs from "fs";

const logFile = path.join(__dirname, "verify_log.txt");

const log = (message) => {
    console.log(message);
    fs.appendFileSync(logFile, message + "\n");
};

// Clear previous log
if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
}

const verifyCommentFeatures = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        log("✅ MongoDB Connected");

        // 1. Setup Users
        const users = await User.find().limit(2);
        if (users.length < 2) {
            log("❌ Need at least 2 users. Please create them first.");
            process.exit(1);
        }
        const author = users[0];
        const commenter = users[1];
        log(`👤 Author: ${author.name}`);
        log(`👤 Commenter: ${commenter.name}`);

        // 2. Create Post
        const post = await Post.create({
            author: author._id,
            content: "Verification Post " + Date.now(),
        });
        log(`\n📝 Post created: ${post._id}`);

        // 3. Add Comment (Simulate Controller)
        log("\n--- Testing Add Comment ---");
        let req = mockReq({ text: "Test Comment" }, { id: post._id }, commenter);
        let res = mockRes();
        await commentPost(req, res);

        let updatedPost = await Post.findById(post._id);
        let commentId = updatedPost.comments[0]._id.toString();
        log(`Comment added: ${updatedPost.comments.length === 1 ? "✅ Passed" : "❌ Failed"}`);

        // 4. Edit Comment (Owner)
        log("\n--- Testing Edit Comment (Owner) ---");
        req = mockReq({ text: "Edited Comment" }, { id: post._id, commentId }, commenter);
        res = mockRes();
        await editComment(req, res);

        updatedPost = await Post.findById(post._id);
        const editedComment = updatedPost.comments[0];
        log(`Edit Success: ${editedComment.text === "Edited Comment" ? "✅ Passed" : "❌ Failed"}`);
        log(`Edit Flag: ${editedComment.isEdited ? "✅ Passed" : "❌ Failed"}`);


        // 5. Edit Comment (Non-Owner)
        log("\n--- Testing Edit Comment (Non-Owner) ---");
        req = mockReq({ text: "Hacked Comment" }, { id: post._id, commentId }, author); // Author trying to edit Commenter's comment
        res = mockRes();
        await editComment(req, res);

        log(`Edit Blocked: ${res.statusCode === 401 ? "✅ Passed" : "❌ Failed (Status: " + res.statusCode + ")"}`);


        // 6. Hide Comment (Post Owner)
        log("\n--- Testing Hide Comment (Post Owner) ---");
        req = mockReq({}, { id: post._id, commentId }, author);
        res = mockRes();
        await hideComment(req, res);

        updatedPost = await Post.findById(post._id);
        log(`Hide Success: ${updatedPost.comments[0].isHidden ? "✅ Passed" : "❌ Failed"}`);

        // 7. Unhide Comment (Post Owner)
        log("\n--- Testing Unhide Comment (Post Owner) ---");
        req = mockReq({}, { id: post._id, commentId }, author);
        res = mockRes();
        await hideComment(req, res);

        updatedPost = await Post.findById(post._id);
        log(`Unhide Success: ${!updatedPost.comments[0].isHidden ? "✅ Passed" : "❌ Failed"}`);


        // 8. Hide Comment (Non-Post Owner)
        log("\n--- Testing Hide Comment (Non-Post Owner) ---");
        req = mockReq({}, { id: post._id, commentId }, commenter); // Commenter trying to hide their own comment (should fail if only post owner can hide)
        res = mockRes();
        await hideComment(req, res);

        log(`Hide Blocked: ${res.statusCode === 401 ? "✅ Passed" : "❌ Failed (Status: " + res.statusCode + ")"}`);


        // 9. Delete Comment (Comment Owner)
        log("\n--- Testing Delete Comment (Comment Owner) ---");
        req = mockReq({}, { id: post._id, commentId }, commenter);
        res = mockRes();
        await deleteComment(req, res);

        updatedPost = await Post.findById(post._id);
        log(`Delete Success: ${updatedPost.comments.length === 0 ? "✅ Passed" : "❌ Failed"}`);


        // Cleanup
        await Post.findByIdAndDelete(post._id);
        log("\n🧹 Cleanup Done");

    } catch (error) {
        log("❌ Error: " + error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyCommentFeatures();
