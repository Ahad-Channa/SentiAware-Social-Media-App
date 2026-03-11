import React, { useState, useEffect } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import api from "../../api/api";
import { useSelector } from "react-redux";

const ChatPage = () => {
    const [selectedChat, setSelectedChat] = useState(null);
    const [friends, setFriends] = useState([]);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const res = await api.get("/api/friends/list");
                setFriends(res.data);
            } catch (error) {
                console.error("Failed to fetch friends for chat", error);
            }
        };
        fetchFriends();
    }, []);

    return (
        <div className="min-h-screen bg-[#1A1A24] pt-8 pb-12 flex justify-center">
            <div className="max-w-[1200px] w-full px-4 sm:px-6 h-[80vh]">
                <div className="bg-[#232330] rounded-xl border border-[#2D2D3B] shadow-sm flex h-full overflow-hidden">

                    {/* Left Sidebar: Conversations */}
                    <div className={`w-full md:w-1/3 border-r border-[#2D2D3B] flex flex-col ${selectedChat ? "hidden md:flex" : "flex"}`}>
                        <ConversationList
                            friends={friends}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat}
                        />
                    </div>

                    {/* Right Area: Chat Window */}
                    <div className={`w-full md:w-2/3 flex flex-col ${!selectedChat ? "hidden md:flex" : "flex"}`}>
                        {selectedChat ? (
                            <ChatWindow
                                selectedChat={selectedChat}
                                setSelectedChat={setSelectedChat}
                                currentUser={user}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <div className="h-16 w-16 mb-4 text-[#2D2D3B]">
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72A8.966 8.966 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Your Messages</h3>
                                <p>Select a friend from the left to start chatting.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChatPage;
