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

// Recursive Comment Component - Minimal Design
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
        <div className="flex gap-3 mt-4 group">
            <Link to={`/profile/${user._id}`} className="flex-shrink-0 mt-1">
                {user.profilePic ? (
                    <img
                        src={user.profilePic}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-gray-100"
                    />
                ) : (
                    <div className="h-8 w-8 rounded-full bg-[#2A2A3A] flex items-center justify-center text-gray-400 text-xs font-bold border border-[#2D2D3B]">
                        {user.name?.[0]?.toUpperCase()}
                    </div>
                )}
            </Link>
            <div className="flex-1 min-w-0">
                <div className={` ${comment.isHidden ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-2 mb-0.5">
                        <Link to={`/profile/${user._id}`} className="font-semibold text-sm text-white hover:text-[#8E54E9] transition-colors">
                            {user.name}
                        </Link>
                        <span className="text-xs text-gray-500">
                            {comment.createdAt && formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </span>
                        {comment.isEdited && <span className="text-[10px] text-gray-400">(edited)</span>}
                        {comment.isHidden && <span className="text-[10px] text-red-500 font-medium bg-red-50 px-1 rounded">Hidden</span>}
                    </div>

                    {isHiddenForViewer ? (
                        <p className="text-gray-400 italic text-sm">Comment hidden by author</p>
                    ) : (
                        isEditing ? (
                            <div className="mt-1">
                                <input
                                    className="w-full text-sm p-2 border border-[#2D2D3B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8E54E9]/20 bg-[#1A1A24] text-white"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    autoFocus
                                />
                                <div className="flex gap-2 mt-2 text-xs">
                                    <button onClick={handleEditSubmit} className="text-white bg-[#8E54E9] hover:bg-[#7A42E4] px-3 py-1 rounded-md transition-colors">Save</button>
                                    <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:bg-[#2A2A3A] px-3 py-1 rounded-md transition-colors">Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-300 text-sm leading-relaxed">{comment.text}</p>
                        )
                    )}
                </div>

                {/* Actions Line */}
                <div className="flex items-center gap-3 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                        onClick={() => setIsReplying(!isReplying)}
                        className="text-xs text-gray-500 hover:text-gray-300 font-medium cursor-pointer transition-colors"
                    >
                        Reply
                    </button>

                    {isCommentAuthor && !isHiddenForViewer && (
                        <>
                            <button onClick={() => setIsEditing(!isEditing)} className="text-xs text-gray-500 hover:text-blue-600">
                                Edit
                            </button>
                            <button onClick={handleDeleteClick} className="text-xs text-gray-500 hover:text-red-600">
                                Delete
                            </button>
                        </>
                    )}

                    {isPostOwner && (
                        <button onClick={handleHide} className="text-xs text-gray-500 hover:text-orange-600">
                            {comment.isHidden ? "Unhide" : "Hide"}
                        </button>
                    )}
                </div>

                {/* Reply Input */}
                {isReplying && (
                    <div className="mt-3 flex items-center gap-2 max-w-lg">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Reply to ${user.name}...`}
                            className="flex-1 bg-[#1A1A24] border border-[#2D2D3B] text-white rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-[#8E54E9] focus:ring-1 focus:ring-[#8E54E9]/20"
                            autoFocus
                        />
                        <button
                            onClick={handleReplySubmit}
                            className="text-xs bg-[#8E54E9] text-white px-3 py-1.5 rounded-lg hover:bg-[#7A42E4] transition-colors"
                        >
                            Send
                        </button>
                    </div>
                )}

                {/* Recursive Nested Replies - Vertical Line Style */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-2 pl-3 border-l-2 border-gray-100">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#232330] rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-[#2D2D3B] animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Comment?</h3>
                        <p className="text-gray-400 text-sm mb-6">This action cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm text-gray-400 hover:bg-[#2A2A3A] hover:text-white rounded-lg font-medium transition-colors border border-[#2D2D3B]"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
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
        <div className="bg-[#232330] rounded-xl border border-[#2D2D3B] p-5 mb-6 transition-all hover:border-gray-600 shadow-sm">
            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#232330] rounded-xl p-6 w-full max-w-sm mx-4 shadow-2xl border border-[#2D2D3B] animate-in fade-in zoom-in duration-200">
                        <h3 className="text-lg font-bold text-white mb-2">Delete Post?</h3>
                        <p className="text-gray-400 text-sm mb-6">Are you sure? This cannot be undone.</p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm text-gray-400 hover:bg-[#2A2A3A] hover:text-white border border-[#2D2D3B] rounded-lg font-medium transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.author._id}`}>
                        {post.author.profilePic ? (
                            <img
                                src={post.author.profilePic}
                                alt={post.author.name}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50"
                            />
                        ) : (
                            <div className="h-10 w-10 rounded-full bg-[#2A2A3A] flex items-center justify-center text-gray-400 font-bold border border-[#2D2D3B]">
                                {post.author.name?.[0]?.toUpperCase()}
                            </div>
                        )}
                    </Link>
                    <div>
                        <Link to={`/profile/${post.author._id}`} className="font-semibold text-white hover:text-[#8E54E9] transition-colors block leading-tight">
                            {post.author.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                </div>

                {/* 3 Dots Menu */}
                {isOwner && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-[#2A2A3A] transition-colors focus:bg-[#2A2A3A] focus:outline-none"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                            </svg>
                        </button>

                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-[#232330] rounded-xl shadow-2xl z-20 border border-[#2D2D3B] py-1 overflow-hidden animate-in fade-in zoom-in duration-150 origin-top-right">
                                <button
                                    onClick={() => {
                                        setIsEditing(true);
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2A2A3A] transition-colors"
                                >
                                    Edit Post
                                </button>
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(true);
                                        setShowMenu(false);
                                    }}
                                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Content */}
            {isEditing ? (
                <div className="mb-4">
                    <textarea
                        className="w-full p-4 border border-[#2D2D3B] rounded-xl focus:ring-2 focus:ring-[#8E54E9]/20 focus:border-[#8E54E9] outline-none resize-none bg-[#1A1A24] text-white text-base"
                        rows="4"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 py-2 text-sm text-gray-400 hover:bg-[#2A2A3A] border border-[#2D2D3B] rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpdate}
                            className="px-4 py-2 text-sm bg-[#8E54E9] text-white rounded-lg hover:bg-[#7A42E4] transition-colors shadow-lg shadow-[#8E54E9]/20"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            ) : (
                <div className="mb-4">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-[15px]">{post.content}</p>
                </div>
            )}

            {post.image && (
                <div className="mb-5 rounded-xl overflow-hidden border border-gray-100">
                    <img src={post.image} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            {/* Moderation Badge */}
            {post.isModerated && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 text-xs font-medium rounded-full mb-4">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    AI Moderated
                </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#2D2D3B]">
                <div className="flex items-center gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${isLiked ? 'text-pink-500' : 'text-gray-400 hover:text-gray-200'}`}
                    >
                        {/* Heart Icon */}
                        <svg className={`w-5 h-5 ${isLiked ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likes.length}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors"
                    >
                        {/* Chat Bubble Icon */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {totalComments > 0 ? (
                            <span>{totalComments}</span>
                        ) : (
                            <span>Comment</span>
                        )}
                    </button>
                </div>

                {/* Share/Bookmark placeholder - could be added here for balance */}
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="mt-4 pt-0">
                    <form onSubmit={handleComment} className="flex items-center gap-3 mb-6 mt-2 relative">
                        {currentUser?.profilePic ? (
                            <img src={currentUser.profilePic} alt="" className="w-8 h-8 rounded-full object-cover ring-1 ring-gray-100" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-[#2A2A3A] flex items-center justify-center text-gray-400 text-xs font-bold">
                                {currentUser?.name?.[0]}
                            </div>
                        )}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-[#1A1A24] text-white border border-transparent hover:border-[#2D2D3B] focus:border-[#8E54E9] rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-0 transition-colors placeholder-gray-500"
                            />
                            {commentText.trim() && (
                                <button
                                    type="submit"
                                    disabled={isSubmittingComment}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 p-1.5 rounded-full hover:bg-[#2A2A3A] hover:text-white transition-colors disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 transform rotate-90" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="space-y-4">
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
