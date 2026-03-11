import React, { useState, useEffect, useRef } from "react";
import api from "../../api/api";
import { useSocketContext } from "../../context/SocketContext";
import { format } from "date-fns";

const ChatWindow = ({ selectedChat, setSelectedChat, currentUser, onMessageSent }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editMessageText, setEditMessageText] = useState("");
    const [openDropdownId, setOpenDropdownId] = useState(null);
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

        const handleNewMessage = (message) => {
            if (
                message.sender._id === selectedChat._id ||
                message.sender === selectedChat._id
            ) {
                setMessages((prev) => [...prev, message]);
            }
        };

        const handleMessageEdited = (editedMessage) => {
            setMessages((prev) => prev.map(m => m._id === editedMessage._id ? editedMessage : m));
        };

        const handleMessageDeleted = (deletedMessageId) => {
            setMessages((prev) => prev.filter(m => m._id !== deletedMessageId));
        };

        socket.on("newMessage", handleNewMessage);
        socket.on("messageEdited", handleMessageEdited);
        socket.on("messageDeleted", handleMessageDeleted);

        return () => {
            socket.off("newMessage", handleNewMessage);
            socket.off("messageEdited", handleMessageEdited);
            socket.off("messageDeleted", handleMessageDeleted);
        };
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

    const handleDeleteMessage = async (messageId) => {
        try {
            await api.delete(`/api/messages/delete/${messageId}`);
            setMessages((prev) => prev.filter(m => m._id !== messageId));
            setOpenDropdownId(null);
        } catch (error) {
            console.error("Failed to delete message", error);
        }
    };

    const startEditing = (message) => {
        setEditingMessageId(message._id);
        setEditMessageText(message.message);
        setOpenDropdownId(null);
    };

    const handleSaveEdit = async (messageId) => {
        if (!editMessageText.trim()) return;
        try {
            const res = await api.put(`/api/messages/edit/${messageId}`, {
                message: editMessageText,
            });
            setMessages((prev) => prev.map(m => m._id === messageId ? res.data : m));
            setEditingMessageId(null);
        } catch (error) {
            console.error("Failed to edit message", error);
        }
    };

    const cancelEditing = () => {
        setEditingMessageId(null);
        setEditMessageText("");
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
                        <h3 className="text-white font-medium">{selectedChat.nickname || selectedChat.name}</h3>
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
                        const isEditing = editingMessageId === m._id;

                        return (
                            <div
                                key={m._id || index}
                                className={`flex ${fromMe ? "justify-end" : "justify-start"} group mb-2`}
                            >
                                {fromMe && !isEditing && (
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center mr-2 relative">
                                        <button 
                                            onClick={() => setOpenDropdownId(openDropdownId === m._id ? null : m._id)}
                                            className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-[#2D2D3B] flex items-center justify-center"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                        
                                        {openDropdownId === m._id && (
                                            <div className="absolute right-0 top-full z-10 w-28 bg-[#232330] border border-[#2D2D3B] rounded-lg shadow-xl overflow-hidden overflow-visible">
                                                <button 
                                                    onClick={() => startEditing(m)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-[#2D2D3B] hover:text-white transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteMessage(m._id)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-[#2D2D3B] hover:text-red-300 transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${fromMe
                                            ? "bg-[#8E54E9] text-white rounded-tr-none"
                                            : "bg-[#2D2D3B] text-gray-200 rounded-tl-none"
                                        }`}
                                >
                                    {isEditing ? (
                                        <div className="flex flex-col gap-2">
                                            <input 
                                                type="text"
                                                autoFocus
                                                value={editMessageText}
                                                onChange={(e) => setEditMessageText(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') handleSaveEdit(m._id);
                                                    if (e.key === 'Escape') cancelEditing();
                                                }}
                                                className="bg-[#1A1A24] text-white border border-[#2D2D3B] rounded px-2 py-1 focus:outline-none focus:border-[#8E54E9] text-sm w-full"
                                            />
                                            <div className="flex justify-end gap-2 text-xs">
                                                <button onClick={cancelEditing} className="text-gray-300 hover:text-white">Cancel</button>
                                                <button onClick={() => handleSaveEdit(m._id)} className="font-semibold text-white">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p>{m.message}</p>
                                            <div className={`flex items-center justify-end gap-1 mt-1 ${fromMe ? "text-purple-200" : "text-gray-400"}`}>
                                                {m.isEdited && <span className="text-[9px] italic">(edited)</span>}
                                                <p className="text-[10px]">
                                                    {m.createdAt ? format(new Date(m.createdAt), "p") : format(new Date(), "p")}
                                                </p>
                                            </div>
                                        </>
                                    )}
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
                        placeholder={`Message ${selectedChat.nickname || selectedChat.name}...`}
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
