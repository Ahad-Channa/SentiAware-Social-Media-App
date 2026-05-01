import Report from "../models/Report.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import cloudinary from "../config/cloudinary.js";

// Auto-removal thresholds
const THRESHOLDS = {
    // Posts already AI-flagged
    flagged_ai: {
        remove: 10,  // AI-flagged posts: auto-remove after 10 reports
    },
    // Clean posts reported for NSFW/violence
    severe: {
        categories: ["nsfw", "violence"],
        remove: 50,  // Auto-remove after 50 reports
        blur_badge: 15,
    },
    // Lower severity categories
    moderate: {
        categories: ["misinformation", "spam", "harassment", "hate_speech", "other"],
        blur_badge: 15,   // Auto-blur + badge after 15 reports
        remove: 50,      // Auto-remove after 50 reports
    },
};

const autoModeratPost = async (post, reportCount, appealCount) => {
    const isAlreadyAIFlagged = post.imageFlag && post.imageFlag !== "community_report";
    const effectiveReports = Math.max(0, reportCount - appealCount);

    // --- Rule 1: AI-flagged post gets 10 effective reports → REMOVE ---
    if (isAlreadyAIFlagged && effectiveReports >= THRESHOLDS.flagged_ai.remove) {
        return "removed";
    }

    // --- Rule 2 & 3: Clean posts → blur+badge at 15, remove at 50 ---
    if (effectiveReports >= THRESHOLDS.severe.remove || effectiveReports >= THRESHOLDS.moderate.remove) {
        return "removed";
    }
    
    // If it was already blurred (flagged), keep it blurred until appeal threshold is met in appealPost
    if (post.moderationStatus === "flagged" && effectiveReports > 0) {
        return "community_flagged";
    }

    if (effectiveReports >= THRESHOLDS.severe.blur_badge || effectiveReports >= THRESHOLDS.moderate.blur_badge) {
        return "community_flagged"; // blur + badge
    }

    return "safe"; // if effective reports drop below thresholds, it returns to safe/unchanged
};

// @desc    Report a post
// @route   POST /api/posts/:id/report
// @access  Private
export const reportPost = async (req, res) => {
    try {
        const { category, note } = req.body;
        const postId = req.params.id;
        const reporterId = req.user._id;

        // Validate category
        const validCategories = ["nsfw", "violence", "hate_speech", "misinformation", "spam", "harassment", "other"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ message: "Invalid report category" });
        }

        // Fetch the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Cannot report your own post
        if (post.author.toString() === reporterId.toString()) {
            return res.status(403).json({ message: "You cannot report your own post" });
        }

        // Cannot report an already-removed post
        if (post.moderationStatus === "removed") {
            return res.status(400).json({ message: "This post has already been removed" });
        }

        // Create report (unique index prevents duplicate from same user)
        try {
            await Report.create({
                reporter: reporterId,
                post: postId,
                category,
                note: note || "",
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({ message: "You have already reported this post" });
            }
            throw err;
        }

        // Count all unique reports for this post
        const reportCount = await Report.countDocuments({ post: postId });
        const appealCount = post.appeals ? post.appeals.length : 0;

        // Run auto-moderation threshold check
        const action = await autoModeratPost(post, reportCount, appealCount);

        if (action === "removed") {
            // Delete image from Cloudinary if exists
            if (post.image) {
                try {
                    const publicIdMatch = post.image.match(/\/upload\/(?:v\d+\/)?([^.]+)/);
                    if (publicIdMatch && publicIdMatch[1]) {
                        await cloudinary.uploader.destroy(publicIdMatch[1]);
                    }
                } catch (err) {
                    console.error("Error deleting image from Cloudinary on community removal:", err);
                }
            }
            post.moderationStatus = "removed";
            post.isModerated = true;
            await post.save();

            // Notify the post author about removal
            await Notification.create({
                recipient: post.author,
                type: "system",
                message: `Your post was automatically removed after receiving multiple community reports for "${category.replace("_", " ")}".`,
                post: post._id,
            });

            return res.status(201).json({
                message: "Report submitted. This post has been automatically removed by community action.",
                action: "removed",
                reportCount,
            });
        }

        if (action === "community_flagged") {
            post.moderationStatus = "flagged";
            post.isModerated = true;
            post.imageFlag = post.imageFlag || "community_report"; // add badge if not already there
            await post.save();

            return res.status(201).json({
                message: "Report submitted. This post has been blurred by community action.",
                action: "community_flagged",
                reportCount,
            });
        }

        // Notify the post author that their post was reported (first time or subsequent)
        await Notification.create({
            recipient: post.author,
            type: "system",
            message: `Someone reported your post for "${category.replace("_", " ")}". It is under review. (${reportCount} report${reportCount > 1 ? 's' : ''} total)`,
            post: post._id,
        });

        res.status(201).json({
            message: "Thank you for your report. We will review it shortly.",
            action: "pending",
            reportCount,
        });
    } catch (error) {
        console.error("Error reporting post:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Appeal a post (Vouch as safe)
// @route   POST /api/posts/:id/appeal
// @access  Private
export const appealPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.moderationStatus === "removed") {
            return res.status(400).json({ message: "Cannot appeal a removed post" });
        }

        // Initialize appeals array if it doesn't exist
        if (!post.appeals) {
            post.appeals = [];
        }

        // Check if user already appealed
        if (post.appeals && post.appeals.includes(userId)) {
            return res.status(400).json({ message: "You have already appealed this post" });
        }

        post.appeals.push(userId);
        await post.save();

        // Notify the post owner about the positive appeal from a community member
        if (post.author.toString() !== userId.toString()) {
            await Notification.create({
                recipient: post.author,
                type: "system",
                message: `Someone vouched for your flagged post as safe! Total appeals: ${post.appeals.length}.`,
                post: post._id,
            });
        }

        const reportCount = await Report.countDocuments({ post: postId });
        const appealCount = post.appeals.length;

        // Ensure we handle the "1 appeal per report" rule and the "50 appeals for AI" rule
        const isAlreadyAIFlagged = post.imageFlag && post.imageFlag !== "community_report";
        let canUnblur = false;

        if (isAlreadyAIFlagged) {
            // If AI flagged it, requires at least 50 appeals to remove the blur
            if (appealCount >= 50) {
                canUnblur = true;
            }
        } else {
            // If reported by community, requires appeals to be greater or equal to reports
            if (appealCount >= reportCount) {
                canUnblur = true;
            }
        }

        // Re-run moderation logic. If appeals restore it below threshold, check if we can unblur.
        const action = await autoModeratPost(post, reportCount, appealCount);

        if (action === "safe" && post.moderationStatus === "flagged") {
            if (canUnblur) {
                post.moderationStatus = "safe";
                post.imageFlag = "";
                await post.save();
                return res.json({ message: "Appeal successful. Post restored to safe status." });
            }
        }

        res.json({ message: "Appeal submitted successfully.", appealCount });
    } catch (error) {
        console.error("Error appealing post:", error);
        res.status(500).json({ message: "Server error" });
    }
};
