
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../api/api";
import FriendButton from "../friends/FriendButton";
import PostList from "../post/PostList";

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserById(id);
        setUser(data);
      } catch (error) {
        console.log("Error loading profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
  }

  if (!user) {
    return <div className="min-h-screen flex justify-center items-center">User not found</div>;
  }

  // Ensure createdAt is returned
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleString("default", { month: "long", year: "numeric" })
    : "Unknown";

  return (
    <div className="min-h-screen bg-[#1A1A24] pb-12">

      {/* Cover Image - Minimal Gray/Slate Pattern or Solid */}
      <div className="h-64 bg-[#0D0D14] w-full object-cover"></div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <div className="relative -mt-20 mb-8 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="relative">
            <div className="h-40 w-40 rounded-full border-[6px] border-[#1A1A24] shadow-sm bg-[#2A2A3A] flex items-center justify-center text-gray-400 text-5xl font-bold overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name[0]?.toUpperCase()
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {user.name}
            </h1>
            <p className="text-gray-400 font-medium">@{user.email?.split('@')[0] || 'user'}</p>
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-300 max-w-lg leading-relaxed">
            {user.bio || "No bio yet."}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-400 font-medium">
            <div className="flex items-center gap-1.5 bg-[#232330] px-3 py-1 rounded-full border border-[#2D2D3B] shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {user.location || "Earth"}
            </div>
            <div className="flex items-center gap-1.5 bg-[#232330] px-3 py-1 rounded-full border border-[#2D2D3B] shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Joined {joinDate}
            </div>
          </div>

          {/* Friend Action Button */}
          <div className="mt-6">
            <FriendButton targetUserId={id} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 max-w-sm mx-auto gap-4 mb-10">
          <div className="bg-[#232330] p-4 rounded-2xl border border-[#2D2D3B] text-center shadow-sm">
            <span className="block text-2xl font-black text-white">{user.totalPosts || 0}</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Posts</span>
          </div>
          <div className="bg-[#232330] p-4 rounded-2xl border border-[#2D2D3B] text-center shadow-sm">
            <span className="block text-2xl font-black text-white">{user.friends?.length || 0}</span>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Friends</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-[#2D2D3B] mb-6">
          <div className="flex justify-center space-x-12">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'posts' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Posts
              {activeTab === 'posts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8E54E9] rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'about' ? 'text-white' : 'text-gray-400 hover:text-gray-200'}`}
            >
              About
              {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8E54E9] rounded-full"></span>}
            </button>
          </div>
        </div>

        {/* User Content */}
        <div className="max-w-2xl mx-auto min-h-[300px]">
          {activeTab === 'posts' && (
            <PostList userId={id} viewMode="grid" />
          )}

          {activeTab === 'about' && (
            <div className="bg-[#232330] rounded-2xl border border-[#2D2D3B] p-8 text-center text-gray-400">
              <p>More detailed information about {user.name} will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
