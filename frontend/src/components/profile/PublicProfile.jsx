// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getUserById } from "../../api/api";
// import FriendButton from "../friends/FriendButton";

// const PublicProfile = () => {
//   const { id } = useParams();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const data = await getUserById(id);
//         setUser(data);
//       } catch (error) {
//         console.log("Error loading profile", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, [id]);

//   if (loading) {
//     return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
//   }

//   if (!user) {
//     return <div className="min-h-screen flex justify-center items-center">User not found</div>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>

//       <div className="max-w-6xl mx-auto px-4 -mt-24">
//         <div className="bg-white shadow-lg rounded-xl p-8">
//           <div className="flex justify-between items-start">
//             {/* Avatar */}
//             <div className="flex items-start space-x-6">
//               <div className="h-32 w-32 rounded-full overflow-hidden bg-purple-300 flex items-center justify-center text-white text-4xl font-bold">
//                 {user.profilePic ? (
//                   <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
//                 ) : (
//                   user.name.charAt(0).toUpperCase()
//                 )}
//               </div>

//               {/* Info */}
//               <div>
//                 <h1 className="text-3xl font-bold">{user.name}</h1>
//                 <p className="text-gray-500">{user.email}</p>
//                 <p className="mt-2 text-gray-700">{user.bio || "No bio yet"}</p>

//                 <div className="mt-2 text-gray-500 flex space-x-4">
//                   <span>📍 {user.location || "Unknown"}</span>
//                   <span>🗓️ Joined {new Date(user.createdAt).toLocaleDateString()}</span>
//                 </div>
//               </div>
//             </div>



//             {/* Friend Button */}
//             <FriendButton targetUserId={id} />
//           </div>
//         </div>

//         {/* Posts Placeholder */}
//         <div className="mt-6 bg-white p-6 rounded-xl shadow">
//           <h2 className="text-xl font-bold mb-3">Posts</h2>
//           <p className="text-gray-500">User posts will appear here…</p>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default PublicProfile;
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
    <div className="min-h-screen bg-gray-50 pb-12">

      {/* Cover Image - Minimal Gray/Slate Pattern or Solid */}
      <div className="h-64 bg-slate-200 w-full object-cover"></div>

      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">

        {/* Profile Header */}
        <div className="relative -mt-20 mb-8 flex flex-col items-center text-center">

          {/* Avatar */}
          <div className="relative">
            <div className="h-40 w-40 rounded-full border-[6px] border-white shadow-sm bg-gray-100 flex items-center justify-center text-gray-400 text-5xl font-bold overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="h-full w-full object-cover" />
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
            <p className="text-gray-500 font-medium">@{user.email?.split('@')[0] || 'user'}</p>
          </div>

          {/* Bio */}
          <p className="mt-4 text-gray-700 max-w-lg leading-relaxed">
            {user.bio || "No bio yet."}
          </p>

          {/* Meta */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500 font-medium">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {user.location || "Earth"}
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm">
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
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900">{user.totalPosts || 0}</span>
            <span className="text-gray-500 text-xs font-bold uppercase tracking-wider">Posts</span>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-sm">
            <span className="block text-2xl font-black text-gray-900">{user.friends?.length || 0}</span>
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

        {/* User Content */}
        <div className="max-w-2xl mx-auto min-h-[300px]">
          {activeTab === 'posts' && (
            <PostList userId={id} viewMode="grid" />
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

export default PublicProfile;
