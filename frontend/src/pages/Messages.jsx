import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import messageService from "../services/messageService";

const Messages = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
      return;
    }

    const loadConversations = async () => {
      if (!user?._id) return;

      try {
        const response = await messageService.getAllMessages();
        setConversations(response.conversations || []);
        
        // Check if starting a new chat with specific user
        const userIdParam = searchParams.get("userId");
        if (userIdParam) {
          // Find existing conversation or create new one
          const existingConv = response.conversations?.find((c) => c.conversationId === userIdParam);
          if (existingConv) {
            setSelectedConversation(existingConv);
          } else {
            // Create new conversation placeholder
            setSelectedConversation({
              conversationId: userIdParam,
              otherUser: { _id: userIdParam },
              lastMessage: "(New conversation)",
            });
          }
        } else {
          // Check for conversation param
          const conversationId = searchParams.get("conversation");
          if (conversationId) {
            const conv = response.conversations?.find((c) => c.conversationId === conversationId);
            if (conv) {
              setSelectedConversation(conv);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load conversations:", error);
      } finally {
        setLoadingConversations(false);
      }
    };

    if (user?._id) {
      loadConversations();
    }
  }, [user, loading, navigate, searchParams]);

  useEffect(() => {
    const loadConversationMessages = async () => {
      if (!selectedConversation || !user?._id) return;

      setLoadingMessages(true);
      try {
        const response = await messageService.getConversation(
          selectedConversation.conversationId
        );
        setMessages(response.messages || []);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // If error loading messages (no conversation yet), just show empty
        if (messages.length === 0) {
          setMessages([]);
        }
      } finally {
        setLoadingMessages(false);
      }
    };

    loadConversationMessages();
  }, [selectedConversation, user?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      await messageService.sendMessage(selectedConversation.conversationId, newMessage);

      // Reload messages
      const response = await messageService.getConversation(selectedConversation.conversationId);
      setMessages(response.messages || []);
      setNewMessage("");
      
      // Reload conversations list to show updated message
      const allMessagesResponse = await messageService.getAllMessages();
      setConversations(allMessagesResponse.conversations || []);
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message: " + (error.message || "Unknown error"));
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8 flex flex-col">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Messages</h1>
            <p className="text-gray-600">Chat with connected alumni and students</p>
          </div>

          <div className="flex gap-6 flex-1">
            {/* Conversations List */}
            <div className="w-80 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loadingConversations ? (
                  <div className="p-4 text-gray-600 text-center">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-gray-600 text-center">
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs mt-2">Connect with students or alumni to start chatting</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <button
                      key={conversation.conversationId}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`w-full px-4 py-3 border-b border-gray-100 text-left transition hover:bg-gray-50 ${
                        selectedConversation?.conversationId === conversation.conversationId
                          ? "bg-blue-50 border-l-4 border-l-blue-600"
                          : ""
                      }`}
                    >
                      <p className="font-semibold text-gray-900">
                        {conversation.otherUser?.firstName} {conversation.otherUser?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(conversation.lastMessageTime).toLocaleDateString()}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Window */}
            <div className="flex-1 bg-white rounded-lg shadow border border-gray-200 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">
                      {selectedConversation.otherUser?.firstName || "User"}{" "}
                      {selectedConversation.otherUser?.lastName || ""}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {selectedConversation.otherUser?.email || "(Starting new conversation)"}
                    </p>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loadingMessages ? (
                      <div className="text-gray-600 text-center">Loading messages...</div>
                    ) : messages.length === 0 ? (
                      <div className="text-gray-600 text-center">
                        No messages yet. Start the conversation!
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`flex ${msg.sender._id === user._id ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${
                              msg.sender._id === user._id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className="text-xs mt-1 opacity-70">
                              {new Date(msg.createdAt).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        disabled={sending}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      />
                      <button
                        type="submit"
                        disabled={sending || !newMessage.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 font-medium"
                      >
                        {sending ? "Sending..." : "Send"}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center flex-1">
                  <p className="text-gray-600 text-lg">Select a conversation to start chatting</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
