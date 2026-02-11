import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import User from "../models/User.js";
import Post from "../models/Post.js";
import { analyzeText } from "../services/moderationService.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const verifyPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // 1. Find a user to be the author
        const user = await User.findOne();
        if (!user) {
            console.log("❌ No users found. Please create a user first.");
            process.exit(1);
        }
        console.log(`👤 Using user: ${user.name} (${user.email})`);

        // 2. Test Moderation Service directly
        console.log("\n🧪 Testing Moderation Service...");
        const safeText = "This is a wonderful day!";
        const toxicText = "I hate this, it is toxic and badword";

        const safeResult = await analyzeText(safeText);
        console.log(`   Safe text check: ${safeResult.safe ? "✅ Passed" : "❌ Failed"}`);

        const toxicResult = await analyzeText(toxicText);
        console.log(`   Toxic text check: ${!toxicResult.safe ? "✅ Detected" : "❌ Failed to detect"}`);
        if (!toxicResult.safe) {
            console.log(`   Masked text: "${toxicResult.moderatedText}"`);
        }

        // 3. Create a clean post directly via Mongoose (Simulating Controller)
        console.log("\n📝 Creating a clean post...");
        const post1 = await Post.create({
            author: user._id,
            content: "Hello world! This is a test post.",
            isModerated: false,
            moderationStatus: "safe"
        });
        console.log(`✅ Post created: ${post1.content}`);

        // 4. Create a toxic post (Simulating Controller logic)
        console.log("\n📝 Creating a toxic post...");
        const modResult = await analyzeText("You are a badword person.");
        const post2 = await Post.create({
            author: user._id,
            content: modResult.safe ? "You are a badword person." : modResult.moderatedText,
            originalContent: "You are a badword person.",
            isModerated: !modResult.safe,
            moderationStatus: modResult.safe ? "safe" : "flagged",
            toxicityScore: modResult.score
        });
        console.log(`✅ Toxic Post created. Content stored as: "${post2.content}"`);
        console.log(`   Is Moderated: ${post2.isModerated}`);

        // 5. Fetch Feed
        console.log("\n📰 Fetching Feed...");
        const feed = await Post.find().sort({ createdAt: -1 }).limit(5);
        console.log(`✅ Fetched ${feed.length} posts from feed.`);
        feed.forEach(p => {
            console.log(`   - [${p.isModerated ? 'MODERATED' : 'SAFE'}] ${p.content}`);
        });

        // 6. Test Update (Edit)
        console.log("\n✏️ Testing Update Post...");
        const updateContent = "This is the updated content.";
        post1.content = updateContent;
        await post1.save();
        const updatedPost = await Post.findById(post1._id);
        console.log(`   Updated Post Content: ${updatedPost.content === updateContent ? "✅ Verified" : "❌ Failed"}`);

        // 7. Test Delete
        console.log("\n🗑️ Testing Delete Post...");
        await post2.deleteOne();
        const deletedPost = await Post.findById(post2._id);
        console.log(`   Delete Check: ${!deletedPost ? "✅ Verified (Gone)" : "❌ Failed (Still exists)"}`);

        // 8. Test Recursive Comment Reply
        console.log("\n💬 Testing Recursive Comment Reply...");

        // 8.1 Create Root Comment
        post1.comments.push({
            user: user._id,
            text: "Root Comment",
            createdAt: new Date()
        });
        await post1.save();
        const rootCommentId = post1.comments[post1.comments.length - 1]._id; // Get last added

        // 8.2 Create Reply to Root
        const rootComment = post1.comments.id(rootCommentId);
        rootComment.replies.push({
            user: user._id,
            text: "Reply to Root",
            createdAt: new Date()
        });
        await post1.save();

        // Reload to get the reply ID
        let postReloaded = await Post.findById(post1._id);
        const replyToRoot = postReloaded.comments.id(rootCommentId).replies[0];
        const replyToRootId = replyToRoot._id;

        console.log(`   Reply to Root Saved: ${replyToRoot.text === "Reply to Root" ? "✅ Verified" : "❌ Failed"}`);

        // 8.3 Create Reply to Reply (Nested)
        // Since we are simulating, we need to find the node and push
        // In the controller, we wrote a recursive helper. Here we access directly for simplicity of test,
        // or we could replicate the helper. Let's access directly.

        postReloaded.comments.id(rootCommentId).replies.id(replyToRootId).replies.push({
            user: user._id,
            text: "Reply to Reply (Nested)",
            createdAt: new Date()
        });
        await postReloaded.save();

        postReloaded = await Post.findById(post1._id);
        const nestedReply = postReloaded.comments.id(rootCommentId).replies.id(replyToRootId).replies[0];

        console.log(`   Nested Reply Saved: ${nestedReply && nestedReply.text === "Reply to Reply (Nested)" ? "✅ Verified" : "❌ Failed"}`);

        // 9. Test Edit Comment (Edit Root Comment)
        console.log("\n✏️ Testing Edit Comment...");
        const rootComment2 = postReloaded.comments.id(rootCommentId);
        rootComment2.text = "Root Comment Edited";
        rootComment2.isEdited = true;
        await postReloaded.save();

        let postEdited = await Post.findById(post1._id);
        const editedComment = postEdited.comments.id(rootCommentId);
        console.log(`   Comment Edited: ${editedComment.text === "Root Comment Edited" && editedComment.isEdited ? "✅ Verified" : "❌ Failed"}`);

        // 10. Test Hide Comment (Hide Nested Reply)
        console.log("\n👁️ Testing Hide Comment...");
        const nestedReplyNode = postEdited.comments.id(rootCommentId).replies.id(replyToRootId).replies[0];
        const nestedReplyId = nestedReplyNode._id;

        // Simulate Toggle Hide
        nestedReplyNode.isHidden = true;
        await postEdited.save();

        let postHidden = await Post.findById(post1._id);
        const hiddenReply = postHidden.comments.id(rootCommentId).replies.id(replyToRootId).replies.id(nestedReplyId);
        console.log(`   Comment Hidden: ${hiddenReply.isHidden ? "✅ Verified" : "❌ Failed"}`);

        // 11. Test Delete Comment (Delete Reply to Root)
        console.log("\n🗑️ Testing Delete Comment...");
        postHidden.comments.id(rootCommentId).replies.pull({ _id: replyToRootId });
        await postHidden.save();

        let postDeleted = await Post.findById(post1._id);
        // We removed 'Reply to Root', so 'Nested Reply' which was inside it is also gone.
        const deletedReply = postDeleted.comments.id(rootCommentId).replies.id(replyToRootId);
        console.log(`   Comment Deleted: ${!deletedReply ? "✅ Verified" : "❌ Failed"}`);

        console.log("\n✨ Verification Complete!");

    } catch (error) {
        console.error("❌ Error:", error);
    } finally {
        await mongoose.disconnect();
    }
};

verifyPosts();
