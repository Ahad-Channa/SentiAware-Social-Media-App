import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../post/PostList';
import { getSuggestedUsers } from '../../api/api';

const Feed = () => {
  // Current user state for "Share something" section
  const [currentUser, setCurrentUser] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);

    // Fetch suggestions
    const fetchSuggestions = async () => {
      try {
        const data = await getSuggestedUsers();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

          {/* Left Sidebar: Mini Profile (Hidden on Mobile) */}
          <aside className="hidden md:block md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">
              <div className="h-24 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              <div className="px-6 pb-6 text-center relative">
                <div className="relative -mt-10 mb-3 inline-block">
                  <div className="h-20 w-20 rounded-full border-4 border-white shadow-md bg-purple-100 flex items-center justify-center text-purple-500 text-2xl font-bold overflow-hidden mx-auto">
                    {currentUser?.profilePic ? (
                      <img src={currentUser.profilePic} alt="Me" className="h-full w-full object-cover" />
                    ) : (
                      currentUser?.name?.[0]?.toUpperCase() || "ME"
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900">{currentUser?.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{currentUser?.email}</p>

                <div className="border-t border-gray-100 pt-4 text-sm text-gray-600 space-y-2 text-left">
                  <Link to="/profile" className="flex items-center justify-between hover:text-purple-600 group">
                    <span>My Profile</span>
                    <span className="text-gray-400 group-hover:text-purple-600">→</span>
                  </Link>
                  <Link to="/friends" className="flex items-center justify-between hover:text-purple-600 group">
                    <span>My Friends</span>
                    <span className="text-gray-400 group-hover:text-purple-600">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Column: Feed */}
          <main className="md:col-span-6 space-y-6">

            {/* Create Post Input */}
            <div className="bg-white rounded-2xl shadow-sm p-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden">
                    {currentUser?.profilePic ? (
                      <img src={currentUser.profilePic} alt="Me" className="h-full w-full object-cover" />
                    ) : (
                      currentUser?.name?.[0]?.toUpperCase() || "ME"
                    )}
                  </div>
                </div>
                <Link
                  to="/create-post"
                  className="flex-grow px-4 py-3 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors text-left"
                >
                  What's on your mind, {currentUser?.name?.split(' ')[0]}?
                </Link>
              </div>
            </div>

            {/* Posts */}
            <PostList />

          </main>

          {/* Right Sidebar: Suggestions (Hidden on Tablet/Mobile) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">

              {/* Suggestions Card */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">People you may know</h3>
                </div>

                <div className="space-y-4">
                  {suggestions.map(s => (
                    <div key={s._id} className="flex items-center space-x-3">
                      <Link to={`/profile/${s._id}`} className="flex-shrink-0">
                        {s.profilePic ? (
                          <img
                            src={s.profilePic}
                            alt={s.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 text-xs font-bold">
                            {s.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link to={`/profile/${s._id}`} className="block text-sm font-semibold text-gray-900 truncate hover:underline">
                          {s.name}
                        </Link>
                        <p className="text-xs text-gray-500 truncate">@{s.username}</p>
                      </div>
                      <Link to={`/profile/${s._id}`} className="text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg">
                        View
                      </Link>
                    </div>
                  ))}
                </div>

                {suggestions.length === 0 && (
                  <p className="text-sm text-gray-500 italic text-center py-2">No new suggestions.</p>
                )}

              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Feed;
