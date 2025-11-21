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

const PublicProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"></div>

      <div className="max-w-6xl mx-auto px-4 -mt-24">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <div className="flex justify-between items-start">

            {/* Avatar */}
            <div className="flex items-start space-x-6">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-purple-300 flex items-center justify-center text-white text-4xl font-bold">
                {user.profilePic ? (
                  <img src={user.profilePic} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <p className="mt-2 text-gray-700">{user.bio || "No bio yet"}</p>

                <div className="mt-2 text-gray-500 flex space-x-4">
                  <span>📍 {user.location || "Unknown"}</span>
                  <span>🗓️ Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>

                {/* ⭐ Friend Stats */}
                <div className="mt-3 flex space-x-6 text-gray-700 font-medium">
                  <span>👥 Friends: {user.friends?.length || 0}</span>
                  <span className="text-blue-600">
                    ➕ Sent: {user.friendRequestsSent?.length || 0}
                  </span>
                  <span className="text-orange-600">
                    📥 Received: {user.friendRequestsReceived?.length || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Friend Button */}
            <FriendButton targetUserId={id} />
          </div>
        </div>

        {/* Posts Placeholder */}
        <div className="mt-6 bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">Posts</h2>
          <p className="text-gray-500">User posts will appear here…</p>
        </div>

      </div>
    </div>
  );
};

export default PublicProfile;
