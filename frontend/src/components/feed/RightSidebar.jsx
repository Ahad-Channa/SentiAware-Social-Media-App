import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSuggestedUsers, sendFriendRequest } from "../../api/api";
import { useSelector } from "react-redux";

const RightSidebar = () => {
    const [allSuggestions, setAllSuggestions] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState({}); // To track sent requests globally or locally
    const currentUser = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const users = await getSuggestedUsers();
                setAllSuggestions(users);
                // Initially pick 4 random or top 4
                pickRandomUsers(users, 4);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchSuggestions();
        }
    }, [currentUser]);

    const pickRandomUsers = (users, count) => {
        if (!users || users.length === 0) {
            setDisplayedUsers([]);
            return;
        }
        // Shuffle array
        const shuffled = [...users].sort(() => 0.5 - Math.random());
        setDisplayedUsers(shuffled.slice(0, count));
    };

    const handleShuffle = () => {
        pickRandomUsers(allSuggestions, 4);
    };

    const handleAddFriend = async (userId) => {
        try {
            await sendFriendRequest(userId);
            setRequestSent((prev) => ({ ...prev, [userId]: true }));
        } catch (error) {
            console.error("Failed to send friend request", error);
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="flex-1">
                                <div className="h-3 bg-gray-200 rounded w-3/4 mb-1"></div>
                                <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (allSuggestions.length === 0) {
        return (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <p className="text-gray-500 text-sm">No suggestions available right now.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sticky top-24">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-900">People you may know</h3>
                <button
                    onClick={handleShuffle}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors cursor-pointer hover:bg-blue-50 px-2 py-1 rounded"
                    title="Shuffle suggestions"
                >
                    Shuffle
                </button>
            </div>

            <div className="space-y-5">
                {displayedUsers.map((user) => (
                    <div key={user._id} className="flex items-center justify-between group">
                        <Link to={`/profile/${user._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                            {user.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.name}
                                    className="h-10 w-10 rounded-full object-cover ring-1 ring-gray-100 group-hover:ring-gray-200 transition-shadow"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs ring-1 ring-gray-100">
                                    {user.name?.[0]?.toUpperCase()}
                                </div>
                            )}
                            <div className="truncate">
                                <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    @{user.username || user.name.toLowerCase().replace(/\s/g, '')}
                                </p>
                            </div>
                        </Link>

                        {requestSent[user._id] ? (
                            <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                Sent
                            </span>
                        ) : (
                            <button
                                onClick={() => handleAddFriend(user._id)}
                                className="ml-2 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Add Friend"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-5 pt-4 border-t border-gray-100">
                <Link to="/search" className="text-xs text-gray-500 hover:text-gray-900 flex items-center justify-center gap-1 transition-colors">
                    Find more people
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </div>
        </div>
    );
};

export default RightSidebar;
