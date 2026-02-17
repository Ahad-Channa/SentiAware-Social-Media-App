import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../post/PostList';
import RightSidebar from './RightSidebar';


const Feed = () => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    setCurrentUser(user);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-8 pb-12">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed Column - WIDER (Span 2) */}
          <main className="lg:col-span-2">

            {/* Create Post Trigger - Minimal & Clean */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {currentUser?.profilePic ? (
                    <img src={currentUser.profilePic} alt="Me" className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-50" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold border border-gray-200">
                      {currentUser?.name?.[0]?.toUpperCase() || "ME"}
                    </div>
                  )}
                </div>
                <Link
                  to="/create-post"
                  className="flex-grow px-4 py-2.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors text-left text-sm font-medium"
                >
                  Start a post...
                </Link>
              </div>
            </div>

            <PostList />
          </main>

          {/* Right Sidebar - Suggestions (Span 1) */}
          <aside className="hidden lg:block lg:col-span-1">
            <RightSidebar />
          </aside>
        </div>

      </div>
    </div>
  );
};

export default Feed;
