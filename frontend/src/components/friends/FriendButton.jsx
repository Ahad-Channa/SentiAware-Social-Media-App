// src/components/friends/FriendButton.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFriendStatus,
  sendFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  unfriendUser,
} from "../../redux/friendsSlice";

const FriendButton = ({ targetUserId }) => {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.friends.statusByUser[targetUserId]);
  const loading = useSelector((state) => state.friends.loading);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (!targetUserId) return;
    dispatch(fetchFriendStatus(targetUserId));
  }, [dispatch, targetUserId]);

  // If profile of current user -> don't show
  if (!currentUser || currentUser._id === targetUserId) return null;

  const onSend = () => dispatch(sendFriendRequest(targetUserId));
  const onCancel = () => dispatch(cancelFriendRequest(targetUserId));
  const onAccept = () => dispatch(acceptFriendRequest(targetUserId));
  const onReject = () => dispatch(rejectFriendRequest(targetUserId));
  const onUnfriend = () => dispatch(unfriendUser(targetUserId));

  // default state while loading
  if (loading && !status) {
    return <button className="px-4 py-2 rounded-lg bg-gray-200" disabled>Loading...</button>;
  }

  switch (status) {
    case "friends":
      return (
        <div className="flex items-center space-x-2">
          <button onClick={onUnfriend} className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600">
            Unfriend
          </button>
        </div>
      );
    case "request_sent":
      return (
        <div className="flex items-center space-x-2">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500">
            Cancel Request
          </button>
        </div>
      );
    case "request_received":
      return (
        <div className="flex items-center space-x-2">
          <button onClick={onAccept} className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600">Accept</button>
          <button onClick={onReject} className="px-4 py-2 rounded-lg bg-gray-200">Reject</button>
        </div>
      );
    default:
      // not_friends or undefined
      return (
        <div className="flex items-center space-x-2">
          <button onClick={onSend} className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600">
            Add Friend
          </button>
        </div>
      );
  }
};

export default FriendButton;
