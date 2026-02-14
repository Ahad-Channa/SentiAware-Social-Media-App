
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const Profile = () => {
//   // Get logged-in user from Redux
//   const loggedInUser = useSelector((state) => state.auth.user);

//   if (!loggedInUser) {
//     return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
//   }

//   const user = {
//     name: loggedInUser.name || 'No Name',
//     username: loggedInUser.email || 'No Username',
//     avatar: loggedInUser.profilePic || 'AR',
//     location: loggedInUser.location || 'Not set',
//     joinDate: loggedInUser.createdAt
//       ? new Date(loggedInUser.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' })
//       : 'Unknown',
//     bio: loggedInUser.bio || 'No bio set',

//     // Stats
//     stats: {
//       positiveScore: loggedInUser.positiveScore || '0%',
//       totalPosts: loggedInUser.totalPosts || 0,
//     },

//     // Only Friends count
//     friends: loggedInUser.friends || [],
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>

//       <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="relative -mt-24">
//           <div className="bg-white rounded-lg shadow-lg p-8">

//             <div className="flex justify-between items-start">
//               <div className="flex items-start space-x-8">

//                 {/* Avatar */}
//                 <div className="h-32 w-32 rounded-full bg-purple-400 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
//                   {user.avatar && user.avatar.startsWith('http') ? (
//                     <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
//                   ) : (
//                     user.avatar
//                   )}
//                 </div>

//                 <div className="flex-grow pt-1">

//                   {/* Name + Edit Profile */}
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-3">
//                       <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>

//                       <span className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-full">
//                         Positive Member
//                       </span>

//                       <Link
//                         to="/edit-profile"
//                         className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
//                       >
//                         Edit Profile
//                       </Link>
//                     </div>
//                   </div>

//                   <p className="text-lg text-gray-500 mt-1">{user.username}</p>
//                   <p className="mt-3 text-gray-600 text-lg">{user.bio}</p>

//                   <div className="mt-3 flex items-center space-x-6 text-base text-gray-500">
//                     <span>📍 {user.location}</span>
//                     <span>🗓️ Joined {user.joinDate}</span>

//                     {/* ⭐ Friend Count ONLY */}
//                     <span>👥 Friends: {user.friends?.length || 0}</span>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* Stats Blocks */}
//             <div className="mt-8 grid grid-cols-2 gap-6">
//               <div className="bg-purple-50 rounded-lg p-6">
//                 <p className="text-purple-600 font-semibold text-lg">Positive Score</p>
//                 <p className="text-3xl font-bold mt-1">{user.stats.positiveScore}</p>
//               </div>

//               <div className="bg-pink-50 rounded-lg p-6">
//                 <p className="text-pink-600 font-semibold text-lg">Total Posts</p>
//                 <p className="text-3xl font-bold mt-1">{user.stats.totalPosts}</p>
//               </div>
//             </div>

//             {/* Tabs */}
//             <div className="mt-6 border-b border-gray-200">
//               <nav className="flex space-x-8">
//                 <button className="border-b-2 border-purple-500 pb-4 px-1 text-purple-600 font-medium">
//                   Posts
//                 </button>
//                 <button className="pb-4 px-1 text-gray-500 font-medium hover:text-gray-700">
//                   Liked
//                 </button>
//                 <button className="pb-4 px-1 text-gray-500 font-medium hover:text-gray-700">
//                   Media
//                 </button>
//               </nav>
//             </div>

//           </div>
//         </div>

//         {/* Example Post (placeholder) */}
//         <div className="mt-6 space-y-4">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex justify-between">
//               <div className="flex space-x-3">
//                 <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
//                   {user.avatar && user.avatar.startsWith('http') ? (
//                     <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
//                   ) : (
//                     user.avatar
//                   )}
//                 </div>

//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <span className="font-medium">{user.name}</span>
//                     <span className="text-gray-500">{user.username}</span>
//                     <span className="text-gray-500">· 1d ago</span>
//                   </div>
//                   <p className="mt-2">Grateful for this supportive community. 🌟</p>
//                 </div>
//               </div>

//               <button className="text-gray-400 hover:text-gray-600">•••</button>
//             </div>

//             <div className="mt-3 flex items-center space-x-4 text-gray-500">
//               <button className="flex items-center space-x-2 hover:text-purple-600">
//                 <span>❤️</span><span>67</span>
//               </button>

//               <button className="flex items-center space-x-2 hover:text-purple-600">
//                 <span>💬</span><span>12</span>
//               </button>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Profile;
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PostList from '../post/PostList';
import { getUserById } from '../../api/api';

const Profile = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const fetchProfile = async () => {
      if (loggedInUser?._id) {
        try {
          const data = await getUserById(loggedInUser._id);
          setProfileData(data);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      }
    };
    fetchProfile();
  }, [loggedInUser]);

  if (!loggedInUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const displayUser = profileData || loggedInUser;
  const joinDate = displayUser.createdAt
    ? new Date(displayUser.createdAt).toLocaleString("default", { month: "long", year: "numeric" })
    : "Unknown";

  const user = {
    name: displayUser.name || "No Name",
    username: displayUser.email ? displayUser.email.split('@')[0] : "user",
    avatar: displayUser.profilePic,
    location: displayUser.location || "Earth",
    joinDate,
    bio: displayUser.bio || "No bio yet.",
    totalPosts: displayUser.totalPosts || 0,
    friendsCount: displayUser.friends ? displayUser.friends.length : 0,
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* Cover Image - Minimal Gray/Slate Pattern or Solid */}
      <div className="h-64 bg-slate-200 w-full object-cover">
        {/* Optional: Add a real cover image feature later. For now, a clean slate background. */}
      </div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <div className="relative -mt-20 mb-8 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="relative">
            <div className="h-40 w-40 rounded-full border-[6px] border-white shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-5xl font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                user.name[0]?.toUpperCase()
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 space-y-2">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {user.name}
            </h1>
            <p className="text-gray-500 font-medium">@{user.username}</p>
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-700 max-w-lg leading-relaxed">
            {user.bio}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {user.location}
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              Joined {user.joinDate}
            </div>
          </div>

          {/* Edit Button */}
          <div className="mt-6">
            <Link
              to="/edit-profile"
              className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full hover:bg-gray-800 transition-all shadow-sm ring-4 ring-transparent hover:ring-gray-100"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 max-w-sm mx-auto gap-4 mb-10">
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900">{user.totalPosts}</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Posts</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900">{user.friendsCount}</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Friends</span>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex justify-center space-x-12">
            <button
              onClick={() => setActiveTab('posts')}
              className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'posts' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Posts
              {activeTab === 'posts' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full"></span>}
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'about' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            >
              About
              {activeTab === 'about' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900 rounded-full"></span>}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="max-w-2xl mx-auto min-h-[300px]">
          {activeTab === 'posts' && (
            <PostList userId={loggedInUser._id || loggedInUser.id} viewMode="grid" />
          )}

          {activeTab === 'about' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500">
              <p>More detailed information about {user.name} will appear here.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
