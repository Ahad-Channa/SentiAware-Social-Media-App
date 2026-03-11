import React, { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import { useSocketContext } from "../../context/SocketContext";
import { format } from "date-fns";

const ChatWindow = ({ selectedChat, setSelectedChat, currentUser, onMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { socket } = useSocketContext();

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/api/messages/${selectedChat._id}`);
                setMessages(res.data);
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoading(false);
            }
        };
        if (selectedChat) fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        if (!socket) return;

        socket.on("newMessage", (message) => {
            if (
                message.sender._id === selectedChat._id ||
                message.sender === selectedChat._id
            ) {
                setMessages((prev) => [...prev, message]);
            }
        });

        return () => socket.off("newMessage");
    }, [socket, selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        try {
            const res = await api.post(`/api/messages/send/${selectedChat._id}`, {
                message: newMessage,
            });
            setMessages((prev) => [...prev, res.data]);
            setNewMessage("");
            if (onMessageSent) {
                onMessageSent(res.data);
            }
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#1A1A24] rounded-r-xl">
            {/* Header */}
            <div className="p-4 border-b border-[#2D2D3B] flex items-center gap-3 bg-[#232330]">
                <button
                    className="md:hidden text-gray-400 hover:text-white"
                    onClick={() => setSelectedChat(null)}
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <div className="flex items-center gap-3">
                    {selectedChat.profilePic ? (
                        <img
                            src={selectedChat.profilePic}
                            alt={selectedChat.name}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#1A1A24] flex items-center justify-center text-gray-400 font-bold border border-[#2D2D3B]">
                            {selectedChat.name?.[0]?.toUpperCase()}
                        </div>
                    )}
                    <div>
                        <h3 className="text-white font-medium">{selectedChat.name}</h3>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="w-8 h-8 border-t-2 border-[#8E54E9] rounded-full animate-spin"></div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <p>Send a message to start chatting with {selectedChat.name}.</p>
                    </div>
                ) : (
                    messages.map((m, index) => {
                        // Some messages from socket might have sender as object instead of string ID
                        const senderId = typeof m.sender === 'object' ? m.sender._id : m.sender;
                        const fromMe = senderId === currentUser._id;

                        return (
                            <div
                                key={m._id || index}
                                className={`flex ${fromMe ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${fromMe
                                            ? "bg-[#8E54E9] text-white rounded-tr-none"
                                            : "bg-[#2D2D3B] text-gray-200 rounded-tl-none"
                                        }`}
                                >
                                    <p>{m.message}</p>
                                    <p className={`text-[10px] mt-1 text-right ${fromMe ? "text-purple-200" : "text-gray-400"}`}>
                                        {m.createdAt ? format(new Date(m.createdAt), "p") : format(new Date(), "p")}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 bg-[#232330] border-t border-[#2D2D3B]">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${selectedChat.name}...`}
                        className="flex-1 bg-[#1A1A24] text-white border border-[#2D2D3B] rounded-full px-4 py-2.5 focus:outline-none focus:border-[#8E54E9] transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="w-11 h-11 bg-[#8E54E9] rounded-full flex items-center justify-center text-white hover:bg-[#7a45cf] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                        <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 ml-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
