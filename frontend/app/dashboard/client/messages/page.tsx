"use client";

import { useEffect, useState } from "react";
import {
  FiBell,
  FiGlobe,
  FiMapPin,
  FiMessageSquare,
  FiMoreVertical,
  FiPaperclip,
  FiPhone,
  FiSearch,
  FiSend,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import ClientHeader from "../../../../components/ClientHeader";
import { messagesAPI } from "../../../../lib/api";

interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  bio?: string;
  joinDate?: string;
  badges?: string[];
  role: "CLIENT" | "PROVIDER";
}

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  time: string;
  isOwn: boolean;
  type?: "text" | "location";
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: string;
}

interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  id: number;
  type: "message" | "mention" | "system";
  title: string;
  content: string;
  time: string;
  read: boolean;
  fromUser?: string;
  avatar?: string;
}

export default function ClientMessagesPage() {
  const [activeSection, setActiveSection] = useState<"teams" | "community">(
    "teams"
  );
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Sample notifications data (will be replaced with real API)
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "message",
      title: "New message from Mike's Plumbing",
      content: "I'll be there at 2 PM for the repair",
      time: "2 mins ago",
      read: false,
      fromUser: "Mike's Plumbing",
      avatar: "MP",
    },
    {
      id: 2,
      type: "system",
      title: "Service Completed",
      content: "Your electrical work has been completed",
      time: "1 hour ago",
      read: true,
      avatar: "🔔",
    },
  ]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messagesAPI.getConversations();
      setConversations(response.data || []);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      // For now, use mock data if API fails
      setConversations(mockConversations);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await messagesAPI.getMessages(conversationId);
      setMessages(response.data || []);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      // Use mock messages if API fails
      setMessages(mockMessages);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation || sending) return;

    const messageContent = message.trim();
    setMessage("");
    setSending(true);

    try {
      const response = await messagesAPI.sendMessage(
        selectedConversation.id,
        messageContent,
        "text"
      );

      // Add the new message to the local state
      const newMessage: Message = {
        id: response.data.id || Date.now().toString(),
        conversationId: selectedConversation.id,
        senderId: "current-user", // Will be replaced with actual user ID
        content: messageContent,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isOwn: true,
        type: "text",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, newMessage]);

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: newMessage,
                updatedAt: newMessage.createdAt,
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessage(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleShareLocation = async () => {
    if (!selectedConversation || !navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const locationData = {
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };

        try {
          await messagesAPI.sendMessage(
            selectedConversation.id,
            "📍 Live location shared",
            "location",
            locationData
          );

          // Add location message to local state
          const locationMsg: Message = {
            id: Date.now().toString(),
            conversationId: selectedConversation.id,
            senderId: "current-user",
            content: "📍 Live location shared",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            isOwn: true,
            type: "location",
            location: locationData,
            createdAt: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, locationMsg]);
        } catch (error) {
          console.error("Failed to share location:", error);
        }
      },
      () => alert("Unable to get location")
    );
  };

  const createNewConversation = async (providerId: string) => {
    try {
      const response = await messagesAPI.createConversation(providerId);
      const newConversation = response.data;
      setConversations((prev) => [newConversation, ...prev]);
      setSelectedConversation(newConversation);
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  // Mock data for development (will be removed when backend is ready)
  const mockConversations: Conversation[] = [
    {
      id: "conv-1",
      participants: [
        {
          id: "provider-1",
          name: "Mike's Plumbing Service",
          avatar: "MP",
          status: "online",
          bio: "Professional plumbing services",
          role: "PROVIDER",
        },
      ],
      lastMessage: {
        id: "msg-1",
        conversationId: "conv-1",
        senderId: "provider-1",
        content: "I'll be there at 2 PM for the kitchen sink repair",
        time: "10:30 AM",
        isOwn: false,
        createdAt: new Date().toISOString(),
      },
      unreadCount: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "conv-2",
      participants: [
        {
          id: "provider-2",
          name: "Sarah's Electrical Solutions",
          avatar: "SE",
          status: "away",
          bio: "Licensed electrician",
          role: "PROVIDER",
        },
      ],
      lastMessage: {
        id: "msg-2",
        conversationId: "conv-2",
        senderId: "provider-2",
        content: "The electrical work is completed. Please check.",
        time: "Yesterday",
        isOwn: false,
        createdAt: new Date().toISOString(),
      },
      unreadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const mockMessages: Message[] = [
    {
      id: "1",
      conversationId: "conv-1",
      senderId: "current-user",
      content: "Hello! I need help with my kitchen sink.",
      time: "10:00 AM",
      isOwn: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      conversationId: "conv-1",
      senderId: "provider-1",
      content: "Sure! I can help you with that. When would be a good time?",
      time: "10:15 AM",
      isOwn: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "3",
      conversationId: "conv-1",
      senderId: "current-user",
      content: "How about 2 PM today?",
      time: "10:20 AM",
      isOwn: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: "4",
      conversationId: "conv-1",
      senderId: "provider-1",
      content: "Perfect! I'll be there at 2 PM for the kitchen sink repair",
      time: "10:30 AM",
      isOwn: false,
      createdAt: new Date().toISOString(),
    },
  ];

  return (
    <>
      <ClientHeader />
      <div className="fixed top-16 left-0 right-0 bottom-0 flex bg-white md:bg-gray-50 overflow-hidden">
        {/* Left Sidebar - Mobile responsive like WhatsApp */}
        <div
          className={`${
            selectedConversation ? "hidden md:flex" : "flex"
          } w-full md:w-80 lg:w-96 bg-white border-r border-gray-200 flex-col overflow-hidden`}
        >
          {/* Mobile Header - WhatsApp style */}
          <div className="md:hidden px-4 py-4 bg-blue-600 text-white flex items-center justify-between">
            <h1 className="text-lg font-semibold">Messages</h1>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-1"
            >
              <FiBell size={20} />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {unreadNotifications > 3 ? "3+" : unreadNotifications}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:block p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
                  💬 Messages
                </h2>
                <p className="text-sm text-gray-600">
                  {conversations.length || 0} conversations
                </p>
              </div>

              {/* Desktop Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <FiBell size={20} />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b border-gray-200">
                      <h3 className="font-medium text-gray-900">
                        Notifications
                      </h3>
                    </div>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                          !notification.read ? "bg-blue-50" : ""
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {notification.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600">
                              {notification.content}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Section Tabs - Desktop only */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveSection("teams")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "teams"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiUsers size={16} />
                Services
              </button>
              <button
                onClick={() => setActiveSection("community")}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeSection === "community"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiGlobe size={16} />
                Community
              </button>
            </div>
          </div>

          {/* Search - WhatsApp style */}
          <div className="p-3 md:p-4 bg-gray-50 md:bg-white border-b border-gray-200">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full md:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
              />
            </div>
          </div>

          {/* Conversation List - WhatsApp style */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading conversations...</div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <FiMessageSquare size={48} className="text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No conversations yet
                </h3>
                <p className="text-gray-600 text-sm">
                  Start a conversation with a service provider to begin
                  messaging
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const otherParticipant = conversation.participants.find(
                  (p) => p.role === "PROVIDER"
                );
                if (!otherParticipant) return null;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation?.id === conversation.id
                        ? "bg-blue-50 md:border-r-2 md:border-r-blue-500"
                        : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          <FiUser size={20} />
                        </div>
                        {otherParticipant.status === "online" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-sm md:text-base font-medium text-gray-900 truncate">
                            {otherParticipant.name}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage?.time || ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600 truncate">
                            {conversation.lastMessage?.content ||
                              "No messages yet"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full min-w-[20px]">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Main Chat Area - WhatsApp style mobile responsive */}
        <div
          className={`${
            selectedConversation ? "flex" : "hidden md:flex"
          } flex-1 flex-col bg-white overflow-hidden`}
        >
          {selectedConversation ? (
            <>
              {/* Chat Header - Fixed */}
              <div className="px-3 md:px-6 py-4 border-b border-gray-200 bg-white flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Mobile Back Button */}
                    <button
                      onClick={() => setSelectedConversation(null)}
                      className="md:hidden text-gray-600 hover:text-gray-800 p-1 -ml-1"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                        <FiUser size={16} />
                      </div>
                      {selectedConversation.participants.find(
                        (p) => p.role === "PROVIDER"
                      )?.status === "online" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                        {selectedConversation.participants.find(
                          (p) => p.role === "PROVIDER"
                        )?.name || "Unknown User"}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600">
                        {selectedConversation.participants.find(
                          (p) => p.role === "PROVIDER"
                        )?.status === "online"
                          ? "Online"
                          : selectedConversation.participants.find(
                              (p) => p.role === "PROVIDER"
                            )?.status || "Offline"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 md:space-x-2">
                    <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FiPhone size={18} />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors">
                      <FiMoreVertical size={18} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area - WhatsApp style */}
              <div
                className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50 bg-opacity-30"
                style={{
                  backgroundImage:
                    "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMDAwMCIgZmlsbC1vcGFjaXR5PSIwLjAyIi8+Cjwvc3ZnPgo=')",
                }}
              >
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-500">
                      <FiMessageSquare
                        size={48}
                        className="mx-auto mb-4 text-gray-300"
                      />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 md:py-3 rounded-lg shadow-sm ${
                          msg.isOwn
                            ? "bg-blue-600 text-white rounded-br-md"
                            : "bg-white text-gray-900 rounded-bl-md"
                        }`}
                      >
                        {msg.type === "location" && msg.location ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <FiMapPin
                                size={16}
                                className={
                                  msg.isOwn ? "text-blue-100" : "text-blue-600"
                                }
                              />
                              <span className="text-sm font-medium">
                                Live Location
                              </span>
                            </div>
                            <div
                              className={`text-xs ${
                                msg.isOwn ? "text-blue-100" : "text-gray-600"
                              }`}
                            >
                              {msg.location.address}
                            </div>
                            <button
                              onClick={() =>
                                window.open(
                                  `https://maps.google.com/?q=${msg.location?.latitude},${msg.location?.longitude}`,
                                  "_blank"
                                )
                              }
                              className={`text-xs underline ${
                                msg.isOwn
                                  ? "text-blue-100 hover:text-white"
                                  : "text-blue-600 hover:text-blue-800"
                              }`}
                            >
                              View on Map
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm md:text-base leading-relaxed">
                            {msg.content}
                          </p>
                        )}
                        <div
                          className={`flex items-center justify-end mt-1 space-x-1 ${
                            msg.isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          <span className="text-xs">{msg.time}</span>
                          {msg.isOwn && (
                            <svg
                              className="w-3 h-3"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input - WhatsApp style with mobile optimization */}
              <div className="p-2 md:p-4 border-t border-gray-200 bg-white flex-shrink-0 pb-20 md:pb-2">
                <div className="flex items-end space-x-2 md:space-x-3">
                  {/* Attachment Button */}
                  <button className="p-2 md:p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full md:rounded-lg transition-colors touch-manipulation">
                    <FiPaperclip
                      size={20}
                      className="md:w-[18px] md:h-[18px]"
                    />
                  </button>

                  {/* Location Button */}
                  <button
                    onClick={handleShareLocation}
                    className="p-2 md:p-2.5 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full md:rounded-lg transition-colors touch-manipulation"
                    title="Share Location"
                  >
                    <FiMapPin size={20} className="md:w-[18px] md:h-[18px]" />
                  </button>

                  {/* Message Input */}
                  <div className="flex-1 relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      placeholder="Message..."
                      rows={1}
                      className="w-full px-3 md:px-4 py-2.5 md:py-3 border border-gray-300 rounded-2xl md:rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm md:text-base leading-relaxed min-h-[42px] max-h-24 overflow-y-auto"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      disabled={sending}
                    />
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim() || sending}
                    className="p-2.5 md:p-3 bg-blue-600 text-white rounded-full md:rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors touch-manipulation min-w-[42px] min-h-[42px] flex items-center justify-center"
                  >
                    {sending ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <FiSend size={18} className="md:w-4 md:h-4" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMessageSquare size={24} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-gray-600 max-w-sm">
                  Choose a conversation from the sidebar to start messaging with
                  your service provider.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}
      </div>
    </>
  );
}
