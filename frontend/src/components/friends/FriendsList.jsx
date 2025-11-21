import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { Link } from "react-router-dom";

const FriendsList = () => {
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    const loadFriends = async () => {
      const res = await api.get("/api/friends/list");
      setFriends(res.data);
    };

    loadFriends();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Your Friends</h1>

      {friends.length === 0 ? (
        <p className="text-gray-600">You have no friends yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {friends.map((f) => (
            <Link
              to={`/profile/${f._id}`}
              key={f._id}
              className="flex items-center bg-white p-4 rounded-lg shadow-sm gap-4"
            >
              <img
                src={f.profilePic}
                className="h-12 w-12 rounded-full object-cover"
                alt=""
              />
              <span className="text-lg font-semibold">{f.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendsList;
