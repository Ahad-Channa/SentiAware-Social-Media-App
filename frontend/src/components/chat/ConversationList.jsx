import React from "react";
import { useSocketContext } from "../../context/SocketContext";

const ConversationList = ({ friends, selectedChat, setSelectedChat }) => {
    const { onlineUsers } = useSocketContext();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[#2D2D3B]">
                <h2 className="text-xl font-bold text-white">Messages</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {friends.length === 0 ? (
                    <p className="text-gray-400 text-center text-sm p-4">No friends to chat with.</p>
                ) : (
                    friends.map((friend) => {
                        const isOnline = onlineUsers.includes(friend._id);
                        const isSelected = selectedChat?._id === friend._id;

                        return (
                            <div
                                key={friend._id}
                                onClick={() => setSelectedChat(friend)}
                                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isSelected ? "bg-[#2D2D3B]" : "hover:bg-[#2A2A3A]"
                                    }`}
                            >
                                <div className="relative flex-shrink-0">
                                    {friend.profilePic ? (
                                        <img
                                            src={friend.profilePic}
                                            alt={friend.name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-[#1A1A24] flex items-center justify-center text-gray-400 font-bold border border-[#2D2D3B]">
                                            {friend.name?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    {isOnline && (
                                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#232330] rounded-full"></span>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="text-white font-medium truncate">{friend.name}</h3>
                                    <p className="text-gray-400 text-sm truncate">@{friend.username || "user"}</p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ConversationList;
