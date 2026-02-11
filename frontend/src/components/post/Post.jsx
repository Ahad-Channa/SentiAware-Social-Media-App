import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { likePost, commentPost, updatePost, deletePost, replyToComment, editComment, deleteComment, hideComment } from '../../api/api';

// Helper to count total comments recursively
const countComments = (comments) => {
    return comments.reduce((acc, comment) => {
        return acc + 1 + (comment.replies ? countComments(comment.replies) : 0);
    }, 0);
};

// Recursive Comment Component
const CommentItem = ({ comment, postId, postAuthorId, onUpdateComments }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Safety check for user object
    const user = comment.user || { name: "Unknown", _id: "unknown", profilePic: "" };
    const currentUser = JSON.parse(localStorage.getItem('user'));

    const isCommentAuthor = currentUser && (currentUser._id === user._id || currentUser.id === user._id);
    const isPostOwner = currentUser && (currentUser._id === postAuthorId || currentUser.id === postAuthorId);

    // If hidden and not post owner, don't show content (or show restricted view)
    const isHiddenForViewer = comment.isHidden && !isPostOwner;

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;
        try {
            const updatedComments = await replyToComment(postId, comment._id, replyText);
            onUpdateComments(updatedComments);
            setReplyText("");
            setIsReplying(false);
        } catch (error) {
            console.error("Reply failed", error);
        }
    };

    const handleEditSubmit = async () => {
        try {
            const updatedComments = await editComment(postId, comment._id, editText);
            onUpdateComments(updatedComments);
            setIsEditing(false);
        } catch (error) {
            console.error("Edit failed", error);
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            const updatedComments = await deleteComment(postId, comment._id);
            onUpdateComments(updatedComments);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleHide = async () => {
        try {
            const updatedComments = await hideComment(postId, comment._id);
            onUpdateComments(updatedComments);
        } catch (error) {
            console.error("Hide failed", error);
        }
    };

    return (
        <div className="flex space-x-3 mt-4">
            <Link to={`/profile/${user._id}`} className="flex-shrink-0">
                {user.profilePic ? (
                    <img
                        src={user.profilePic}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold">
                        {user.name?.[0]?.toUpperCase()}
                    </div>
                )}
            </Link>
            <div className="flex-1">
                <div className={`bg-gray-50 rounded-2xl px-4 py-2 inline-block min-w-[200px] ${comment.isHidden ? 'opacity-75 border border-dashed border-gray-300' : ''}`}>
                    <div className="flex items-center space-x-2 mb-1">
                        <Link to={`/profile/${user._id}`} className="font-semibold text-sm hover:underline">
                            {user.name}
                        </Link>
                        <span className="text-xs text-gray-500">
                            {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {comment.isEdited && <span className="text-[10px] text-gray-400">(edited)</span>}
                        {comment.isHidden && <span className="text-[10px] text-red-400 pl-2">Hidden</span>}
                    </div>

                    {isHiddenForViewer ? (
                        <p className="text-gray-400 italic text-sm">Comment hidden by author</p>
                    ) : (
                        isEditing ? (
                            <div>
                                <input
                                    className="w-full text-sm p-1 border rounded"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <div className="flex space-x-2 mt-1 text-xs">
                                    <button onClick={handleEditSubmit} className="text-blue-600">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="text-gray-500">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-800 text-sm whitespace-pre-wrap">{comment.text}</p>
                        )
                    )}
                </div>

                {/* Actions Line */}
                <div className="flex items-center space-x-3 mt-1 ml-2">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs text-gray-500 hover:text-purple-600 font-medium cursor-pointer"
                    >
                        Reply
                    </button>

                    {isCommentAuthor && !isHiddenForViewer && (
                        <>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-gray-400 hover:text-blue-600">
                                Edit
                            </button>
                            <button onClick={handleDeleteClick} className="text-xs text-gray-400 hover:text-red-600">
                                Delete
                            </button>
                        </>
                    )}

                    {isPostOwner && (
                        <button onClick={handleHide} className="text-xs text-gray-400 hover:text-orange-600">
                            {comment.isHidden ? "Unhide" : "Hide"}
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-2 flex items-center space-x-2 max-w-md">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${user.name}...`}
                            className="flex-1 bg-white border border-gray-200 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-200"
                            autoFocus
                        />
                        <button
                            onClick={handleReplySubmit}
                            className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded hover:bg-purple-200"
                        >
                            Send
                        </button>
                    </div>
                )}

                {/* Recursive Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="border-l-2 border-gray-100 pl-3">
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply._id}
                                comment={reply}
                                postId={postId}
                                postAuthorId={postAuthorId}
                                onUpdateComments={onUpdateComments}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal for Comment */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Comment</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete this comment? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Post = ({ post, onPostUpdated, onPostDeleted }) => {
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    // Menu & Edit State
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(post.content);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const menuRef = useRef(null);

    const currentUser = JSON.parse(localStorage.getItem('user'));
    const isLiked = post.likes.some(id => id === currentUser?.id || id === currentUser?._id);
    const isOwner = currentUser && (currentUser._id === post.author._id || currentUser.id === post.author._id);

    const totalComments = countComments(post.comments || []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLike = async () => {
        try {
            const updatedLikes = await likePost(post._id);
            onPostUpdated({ ...post, likes: updatedLikes });
        } catch (error) {
            console.error("Error liking post:", error);
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setIsSubmittingComment(true);
        try {
            const updatedComments = await commentPost(post._id, commentText);
            onPostUpdated({ ...post, comments: updatedComments });
            setCommentText('');
        } catch (error) {
            console.error("Error commenting:", error);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleUpdate = async () => {
        try {
            const updatedPost = await updatePost(post._id, editContent);
            onPostUpdated(updatedPost);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("Failed to update post");
        }
    };

    const handleDelete = async () => {
        try {
            await deletePost(post._id);
            if (onPostDeleted) onPostDeleted(post._id);
            setShowDeleteModal(false);
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("Failed to delete post");
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-4 relative">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Post</h3>
                        <p className="text-gray-500 mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <Link to={`/profile/${post.author._id}`}>
                        {post.author.profilePic ? (
                            <img
                                src={post.author.profilePic}
                                alt={post.author.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                                {post.author.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </Link>
                    <div>
                        <Link to={`/profile/${post.author._id}`} className="font-semibold text-gray-900 hover:underline">
                            {post.author.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* 3 Dots Menu */}
                {isOwner && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
                        >
                            <span className="text-xl">•••</span>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100 ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    <button
                                        onClick={() => {
                                            setIsEditing(true);
                                            setShowMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowDeleteModal(true);
                                            setShowMenu(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 outline-none resize-none"
                        rows="4"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            Save
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>
            )}

            {post.image && (
                <div className="mb-4 rounded-xl overflow-hidden">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-contain" />
                </div>
            )}

            {/* Moderation Badge */}
            {post.isModerated && (
                <div className="text-xs text-orange-500 mb-2">
                    ⚠️ AI Moderated Content
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                    >
                        <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
                        <span>{post.likes.length} Likes</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500"
                    >
                        <span className="text-xl">💬</span>
                        <span>{totalComments} Comments</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <form onSubmit={handleComment} className="flex items-center space-x-2 mb-4">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-100"
                        />
                        <button
                            type="submit"
                            disabled={isSubmittingComment || !commentText.trim()}
                            className="text-purple-600 font-semibold disabled:text-gray-300"
                        >
                            Post
                        </button>
                    </form>

                    <div className="space-y-0">
                        {post.comments.map((comment) => (
                            <CommentItem
                                key={comment._id}
                                comment={comment}
                                postId={post._id}
                                postAuthorId={post.author._id}
                                onUpdateComments={(updatedComments) => onPostUpdated({ ...post, comments: updatedComments })}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Post;
