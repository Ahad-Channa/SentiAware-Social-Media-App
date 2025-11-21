
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
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Profile = () => {
  const loggedInUser = useSelector((state) => state.auth.user);

  if (!loggedInUser) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Ensure createdAt is returned (fallback to empty string)
  const joinDate = loggedInUser.createdAt
    ? new Date(loggedInUser.createdAt).toLocaleString("default", { month: "long", year: "numeric" })
    : "Unknown";

  const user = {
    name: loggedInUser.name || "No Name",
    username: loggedInUser.email || "No Username",
    avatar: loggedInUser.profilePic || "AR",
    location: loggedInUser.location || "Not set",
    joinDate,
    bio: loggedInUser.bio || "No bio set",

    stats: {
      positiveScore: loggedInUser.positiveScore || "0%",
      totalPosts: loggedInUser.totalPosts || 0,
    },

    friends: loggedInUser.friends || [],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24">
          <div className="bg-white rounded-lg shadow-lg p-8">

            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-8">

                {/* Avatar */}
                <div className="h-32 w-32 rounded-full bg-purple-400 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                  {user.avatar && user.avatar.startsWith("http") ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    user.avatar
                  )}
                </div>

                <div className="flex-grow pt-1">

                  {/* Name + Edit Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>

                      <span className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-full">
                        Positive Member
                      </span>

                      <Link
                        to="/edit-profile"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Edit Profile
                      </Link>
                    </div>
                  </div>

                  <p className="text-lg text-gray-500 mt-1">{user.username}</p>
                  <p className="mt-3 text-gray-600 text-lg">{user.bio}</p>

                  {/* Location + Join Date + Friends */}
                  <div className="mt-3 flex items-center space-x-6 text-base text-gray-500">
                    <span>📍 {user.location}</span>
                    <span>🗓️ Joined {user.joinDate}</span>

                    {/* ⭐ Friend Count */}
                    <span>👥 Friends: {user.friends.length}</span>
                  </div>

                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="bg-purple-50 rounded-lg p-6">
                <p className="text-purple-600 font-semibold text-lg">Positive Score</p>
                <p className="text-3xl font-bold mt-1">{user.stats.positiveScore}</p>
              </div>

              <div className="bg-pink-50 rounded-lg p-6">
                <p className="text-pink-600 font-semibold text-lg">Total Posts</p>
                <p className="text-3xl font-bold mt-1">{user.stats.totalPosts}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Placeholder Post */}
        <div className="mt-6 space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between">
              <div className="flex space-x-3">
                <div className="h-10 w-10 rounded-full bg-purple-400 flex items-center justify-center text-white font-bold">
                  {user.avatar && user.avatar.startsWith("http") ? (
                    <img src={user.avatar} alt="Avatar" className="h-full w-full object-cover rounded-full" />
                  ) : (
                    user.avatar
                  )}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-gray-500">{user.username}</span>
                    <span className="text-gray-500">· 1d ago</span>
                  </div>
                  <p className="mt-2">Grateful for this supportive community. 🌟</p>
                </div>
              </div>

              <button className="text-gray-400 hover:text-gray-600">•••</button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
