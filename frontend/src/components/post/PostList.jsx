import React, { useEffect, useState } from 'react';
import Post from './Post';
import { getFeedPosts, getUserPosts } from '../../api/api';

const PostList = ({ userId, refreshTrigger }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            let data;
            if (userId) {
                data = await getUserPosts(userId);
            } else {
                data = await getFeedPosts();
            }
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("Failed to load posts.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [userId, refreshTrigger]);

    const handlePostUpdate = (updatedPost) => {
        setPosts(prevPosts =>
            prevPosts.map(p => p._id === updatedPost._id ? updatedPost : p)
        );
    };

    const handlePostDelete = (deletedPostId) => {
        setPosts(prevPosts => prevPosts.filter(p => p._id !== deletedPostId));
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                            </div>
                        </div>
                        <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500 py-8">{error}</div>;
    }

    if (posts.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8 bg-white rounded-xl shadow-sm">
                <p className="text-lg">No posts yet.</p>
                <p className="text-sm">Be the first to share something!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <Post
                    key={post._id}
                    post={post}
                    onPostUpdated={handlePostUpdate}
                    onPostDeleted={handlePostDelete}
                />
            ))}
        </div>
    );
};

export default PostList;
