import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { acceptFriendRequest, rejectFriendRequest } from "../../redux/friendsSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const FriendRequests = () => {
  const [requests, setRequests] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadRequests = async () => {
      const res = await api.get("/api/friends/requests");
      setRequests(res.data);
    };

    loadRequests();
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Friend Requests</h1>

      {requests.length === 0 ? (
        <p className="text-gray-600">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((user) => (
            <div
              key={user._id}
              className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm"
            >
              <Link to={`/profile/${user._id}`} className="flex items-center space-x-3">
                <img
                  src={user.profilePic}
                  className="h-12 w-12 rounded-full object-cover"
                  alt=""
                />
                <span className="text-lg font-semibold">{user.name}</span>
              </Link>

              <div className="flex gap-2">
                <button
                  onClick={() => dispatch(acceptFriendRequest(user._id))}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => dispatch(rejectFriendRequest(user._id))}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
