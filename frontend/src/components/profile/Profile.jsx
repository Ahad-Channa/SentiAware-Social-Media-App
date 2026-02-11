
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

  // Use profileData if available, otherwise fall back to loggedInUser
  const displayUser = profileData || loggedInUser;

  // Ensure createdAt is returned (fallback to empty string)
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
    <div className="min-h-screen bg-gray-50">
      {/* Banner */}
      <div className="h-60 bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 mb-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">

              {/* Profile Header Block */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

                {/* Avatar */}
                <div className="flex-shrink-0 relative">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-md bg-purple-100 flex items-center justify-center text-purple-500 text-5xl font-bold overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                    ) : (
                      user.name[0]?.toUpperCase()
                    )}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left space-y-3 pt-2">
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-900 leading-tight">{user.name}</h1>
                      <p className="text-gray-500 font-medium text-lg">@{user.username}</p>
                    </div>

                    <Link
                      to="/edit-profile"
                      className="px-5 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
                    >
                      Edit Profile
                    </Link>
                  </div>

                  <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                    {user.bio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-gray-500 text-sm font-medium pt-1">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      {user.location}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      Joined {user.joinDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Divider */}
              <div className="my-8 border-b border-gray-100"></div>

              {/* Stats Row */}
              <div className="flex justify-center md:justify-start gap-8 md:gap-16">
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-bold text-gray-900">{user.totalPosts}</span>
                  <span className="text-gray-500 font-medium">Posts</span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-bold text-gray-900">{user.friendsCount}</span>
                  <span className="text-gray-500 font-medium">Friends</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-3xl mx-auto pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Recent Posts</h2>
            {/* Could add tabs here later: Posts | Media | Likes */}
          </div>

          <PostList userId={loggedInUser._id || loggedInUser.id} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
