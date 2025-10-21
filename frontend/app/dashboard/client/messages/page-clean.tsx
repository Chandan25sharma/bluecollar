"use client";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  lastSeen?: string;
  bio?: string;
  joinDate?: string;
  badges?: string[];
}

interface Message {
  id: number;
  userId: number;
  text: string;
  time: string;
  isOwn: boolean;
}

interface Chat {
  id: number;
  user: User;
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
  messages: Message[];
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

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState<"teams" | "community">(
    "teams"
  );
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarTab, setRightSidebarTab] = useState<
    "info" | "media" | "links" | "settings"
  >("info");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sample notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: 1,
      type: "message",
      title: "New message from John Doe",
      content: "Hey! Ready for today's coding challenge?",
      time: "2 mins ago",
      read: false,
      fromUser: "John Doe",
      avatar: "JD",
    },
    {
      id: 2,
      type: "mention",
      title: "You were mentioned in Team Alpha",
      content: "@you Let's discuss the new features",
      time: "5 mins ago",
      read: false,
      fromUser: "Team Alpha",
      avatar: "TA",
    },
    {
      id: 3,
      type: "system",
      title: "System Update",
      content: "New chat features are now available!",
      time: "1 hour ago",
      read: true,
      avatar: "🔔",
    },
    {
      id: 4,
      type: "message",
      title: "Sarah Chen sent a file",
      content: "algorithm_solution.js",
      time: "3 hours ago",
      read: true,
      fromUser: "Sarah Chen",
      avatar: "SC",
    },
  ]);

  // Count unread notifications
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // Sample users and chats data (Telegram-like)
  const users: User[] = [
    {
      id: 1,
      name: "John Doe",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
      status: "online",
      bio: "Full-stack developer passionate about React and Node.js",
      joinDate: "March 2024",
      badges: ["Pro Member", "Top Contributor"],
    },
    {
      id: 2,
      name: "Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
      status: "away",
      lastSeen: "2 hours ago",
      bio: "AI/ML Engineer and competitive programmer",
      joinDate: "January 2024",
      badges: ["Expert", "Algorithm Master"],
    },
    {
      id: 3,
      name: "Alex Kumar",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
      status: "offline",
      lastSeen: "Yesterday",
      bio: "Backend developer specializing in microservices",
      joinDate: "February 2024",
      badges: ["Senior Dev"],
    },
  ];

  const chats: Record<string, Chat[]> = {
    teams: [
      {
        id: 1,
        user: users[0],
        unread: 3,
        lastMessage: "Hey! Ready for today's coding challenge?",
        lastMessageTime: "2:30 PM",
        messages: [
          {
            id: 1,
            userId: 1,
            text: "Hey there! How's your day going?",
            time: "2:25 PM",
            isOwn: false,
          },
          {
            id: 2,
            userId: 0,
            text: "Going great! Just finished debugging a tricky issue",
            time: "2:27 PM",
            isOwn: true,
          },
          {
            id: 3,
            userId: 1,
            text: "Nice! What was the issue about?",
            time: "2:28 PM",
            isOwn: false,
          },
          {
            id: 4,
            userId: 1,
            text: "Hey! Ready for today's coding challenge?",
            time: "2:30 PM",
            isOwn: false,
          },
        ],
      },
      {
        id: 2,
        user: users[1],
        unread: 0,
        lastMessage: "Thanks for helping with the algorithm!",
        lastMessageTime: "1:45 PM",
        messages: [
          {
            id: 1,
            userId: 2,
            text: "Could you help me with this sorting problem?",
            time: "1:30 PM",
            isOwn: false,
          },
          {
            id: 2,
            userId: 0,
            text: "Sure! Send me the details",
            time: "1:35 PM",
            isOwn: true,
          },
          {
            id: 3,
            userId: 2,
            text: "Thanks for helping with the algorithm!",
            time: "1:45 PM",
            isOwn: false,
          },
        ],
      },
      {
        id: 3,
        user: users[2],
        unread: 1,
        lastMessage: "Let's collaborate on the new project",
        lastMessageTime: "11:20 AM",
        messages: [
          {
            id: 1,
            userId: 3,
            text: "Have you seen the new project requirements?",
            time: "11:15 AM",
            isOwn: false,
          },
          {
            id: 2,
            userId: 3,
            text: "Let's collaborate on the new project",
            time: "11:20 AM",
            isOwn: false,
          },
        ],
      },
      {
        id: 4,
        user: { ...users[0], name: "Team Alpha" },
        unread: 2,
        lastMessage: "Sprint planning meeting at 3 PM",
        lastMessageTime: "10:30 AM",
        messages: [],
      },
    ],
    community: [
      {
        id: 5,
        user: { ...users[1], name: "React Community" },
        unread: 5,
        lastMessage: "New React 19 features discussion",
        lastMessageTime: "Yesterday",
        messages: [],
      },
      {
        id: 6,
        user: { ...users[2], name: "JavaScript Developers" },
        unread: 2,
        lastMessage: "ES2024 features are amazing!",
        lastMessageTime: "2 hours ago",
        messages: [],
      },
      {
        id: 7,
        user: { ...users[0], name: "CoderspaE General" },
        unread: 8,
        lastMessage: "Welcome to the community!",
        lastMessageTime: "5 hours ago",
        messages: [],
      },
    ],
  };

  const handleSendMessage = () => {
    if (!message.trim() || !selectedChat) return;

    // Add message to current chat (in real app, this would be handled by backend)
    console.log("Sending message:", message);
    setMessage("");
  };
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0d1117" }}>
      {/* Main Chat Layout - Fixed positioning after main header */}
      <div className="fixed top-16 left-0 right-0 bottom-0 flex">
        {/* Mobile Toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden fixed top-20 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg shadow-lg"
        >
          ☰
        </button>

        {/* Left Sidebar - Chat List */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 fixed md:relative z-40 w-80 transition-transform h-full`}
          style={{
            backgroundColor: "#161b22",
            borderRight: "1px solid #30363d",
          }}
        >
          {/* Sidebar Header */}
          <div
            className="p-4 border-b"
            style={{
              backgroundColor: "#161b22",
              borderBottom: "1px solid #30363d",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2
                  className="font-bold text-lg flex items-center gap-2"
                  style={{ color: "#c9d1d9" }}
                >
                  💬 Messages
                </h2>
                <p className="text-sm mt-1" style={{ color: "#8b949e" }}>
                  {chats[activeSection]?.length || 0} conversations
                </p>
              </div>

              {/* Notification Bell - Telegram Style */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-full transition-colors"
                  style={{
                    color: "#8b949e",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#21262d")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                  title="Notifications"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>

                  {/* Notification Badge */}
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadNotifications > 9 ? "9+" : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown - Telegram Style */}
                {notificationsOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-80 rounded-lg shadow-xl z-50 max-h-96 overflow-hidden"
                    style={{
                      backgroundColor: "#161b22",
                      border: "1px solid #30363d",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="p-4 border-b"
                      style={{
                        backgroundColor: "#161b22",
                        borderBottom: "1px solid #30363d",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <h3
                          className="font-semibold"
                          style={{ color: "#c9d1d9" }}
                        >
                          Notifications
                        </h3>
                        <div className="flex items-center gap-2">
                          {unreadNotifications > 0 && (
                            <button
                              className="text-xs transition-colors"
                              style={{ color: "#00e0ff" }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.color = "#00b8d4")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.color = "#00e0ff")
                              }
                              onClick={() => {
                                // Mark all as read logic would go here
                                console.log("Mark all as read");
                              }}
                            >
                              Mark all read
                            </button>
                          )}
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className="transition-colors"
                            style={{ color: "#8b949e" }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#c9d1d9")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#8b949e")
                            }
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto max-h-80">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                              !notification.read
                                ? "bg-blue-50 border-l-4 border-l-blue-500"
                                : ""
                            }`}
                            onClick={() => {
                              // Handle notification click
                              console.log(
                                "Clicked notification:",
                                notification
                              );
                              setNotificationsOpen(false);
                            }}
                          >
                            <div className="flex items-start gap-3">
                              {/* Avatar */}
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                                  notification.type === "system"
                                    ? "bg-gray-500"
                                    : "bg-gradient-to-r from-blue-500 to-purple-500"
                                }`}
                              >
                                {notification.avatar ||
                                  notification.fromUser?.charAt(0) ||
                                  "📢"}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <h4
                                    className={`text-sm font-medium truncate ${
                                      !notification.read
                                        ? "text-gray-900"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {notification.title}
                                  </h4>
                                  <span className="text-xs text-gray-500 ml-2">
                                    {notification.time}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 truncate mt-1">
                                  {notification.content}
                                </p>

                                {/* Notification Type Badge */}
                                <div className="flex items-center gap-2 mt-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      notification.type === "message"
                                        ? "bg-blue-100 text-blue-800"
                                        : notification.type === "mention"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-gray-100 text-gray-600"
                                    }`}
                                  >
                                    {notification.type === "message"
                                      ? "💬 Message"
                                      : notification.type === "mention"
                                      ? "@️ Mention"
                                      : "🔔 System"}
                                  </span>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <div className="text-4xl mb-2">🔔</div>
                          <p>No notifications yet</p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                      <div className="p-3 border-t bg-gray-50 text-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                          View all notifications
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-1 mt-3">
              <button
                onClick={() => setActiveSection("teams")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "teams" ? "" : ""
                }`}
                style={{
                  backgroundColor:
                    activeSection === "teams" ? "#1f6feb" : "#21262d",
                  color: activeSection === "teams" ? "#ffffff" : "#c9d1d9",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== "teams") {
                    e.currentTarget.style.backgroundColor = "#30363d";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== "teams") {
                    e.currentTarget.style.backgroundColor = "#21262d";
                  }
                }}
              >
                Teams
                <span className="block text-xs opacity-75">Personal</span>
              </button>
              <button
                onClick={() => setActiveSection("community")}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeSection === "community" ? "" : ""
                }`}
                style={{
                  backgroundColor:
                    activeSection === "community" ? "#1f6feb" : "#21262d",
                  color: activeSection === "community" ? "#ffffff" : "#c9d1d9",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== "community") {
                    e.currentTarget.style.backgroundColor = "#30363d";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== "community") {
                    e.currentTarget.style.backgroundColor = "#21262d";
                  }
                }}
              >
                Community
                <span className="block text-xs opacity-75">Global</span>
              </button>
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto font-mono">
            {chats[activeSection]?.map((chat) => (
              <div
                key={chat.id}
                onClick={() => {
                  setSelectedChat(chat);
                  setSidebarOpen(false);
                }}
                className="p-4 cursor-pointer transition-all border-l-4"
                style={{
                  borderBottom: "1px solid #30363d",
                  backgroundColor:
                    selectedChat?.id === chat.id ? "#0d1117" : "transparent",
                  borderLeftColor:
                    selectedChat?.id === chat.id ? "#00e0ff" : "transparent",
                  boxShadow:
                    selectedChat?.id === chat.id
                      ? "inset 0 0 10px rgba(0, 224, 255, 0.1)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (selectedChat?.id !== chat.id) {
                    e.currentTarget.style.backgroundColor = "#161b22";
                    e.currentTarget.style.borderLeftColor = "#1f6feb";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedChat?.id !== chat.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderLeftColor = "transparent";
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Terminal-style Avatar */}
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded border flex items-center justify-center font-bold font-mono text-sm"
                      style={{
                        backgroundColor: "#21262d",
                        borderColor:
                          chat.user.status === "online" ? "#00e0ff" : "#30363d",
                        color: "#c9d1d9",
                        boxShadow:
                          chat.user.status === "online"
                            ? "0 0 8px rgba(0, 224, 255, 0.3)"
                            : "none",
                      }}
                    >
                      [{chat.user.name.charAt(0)}]
                    </div>
                    {/* Terminal-style status indicator */}
                    <div
                      className="absolute -bottom-1 -right-1 w-3 h-3 border font-mono text-xs flex items-center justify-center"
                      style={{
                        backgroundColor: "#0d1117",
                        borderColor:
                          chat.user.status === "online"
                            ? "#00ff88"
                            : chat.user.status === "away"
                            ? "#ffaa00"
                            : "#6e7681",
                        color:
                          chat.user.status === "online"
                            ? "#00ff88"
                            : chat.user.status === "away"
                            ? "#ffaa00"
                            : "#6e7681",
                      }}
                      title={chat.user.status}
                    >
                      {chat.user.status === "online"
                        ? "●"
                        : chat.user.status === "away"
                        ? "◐"
                        : "○"}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      {/* Terminal-style username */}
                      <span
                        className="font-medium truncate font-mono"
                        style={{ color: "#00e0ff" }}
                      >
                        {chat.user.name.toLowerCase().replace(" ", "_")}@chat
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs font-mono"
                          style={{ color: "#6e7681" }}
                        >
                          [{chat.lastMessageTime}]
                        </span>
                        {chat.unread > 0 && (
                          <span
                            className="text-xs px-2 py-1 rounded font-mono font-bold border"
                            style={{
                              backgroundColor: "#0d1117",
                              color: "#ff6b6b",
                              borderColor: "#ff6b6b",
                              boxShadow: "0 0 5px rgba(255, 107, 107, 0.3)",
                            }}
                          >
                            [{chat.unread}]
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Terminal-style last message */}
                    <p
                      className="text-sm truncate mt-1 font-mono"
                      style={{ color: "#8b949e" }}
                    >
                      &gt; {chat.lastMessage}
                    </p>
                    {/* Terminal prompt line */}
                    <div
                      className="text-xs mt-1 font-mono opacity-50"
                      style={{ color: "#6e7681" }}
                    >
                      ──────────────────────────
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Terminal-style "end of list" indicator */}
            <div className="p-4 text-center">
              <div className="text-xs font-mono" style={{ color: "#6e7681" }}>
                ──── EOF: {chats[activeSection]?.length || 0} active sessions
                ────
              </div>
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header - Terminal Style */}
              <div
                className="p-4 shadow-sm font-mono border-b-2"
                style={{
                  backgroundColor: "#0d1117",
                  borderBottomColor: "#00e0ff",
                }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setRightSidebarOpen(true)}
                  >
                    {/* Terminal-style user info */}
                    <div className="relative">
                      <div
                        className="w-10 h-10 border flex items-center justify-center font-bold text-sm"
                        style={{
                          backgroundColor: "#21262d",
                          borderColor:
                            selectedChat.user.status === "online"
                              ? "#00e0ff"
                              : "#30363d",
                          color: "#c9d1d9",
                          boxShadow:
                            selectedChat.user.status === "online"
                              ? "0 0 8px rgba(0, 224, 255, 0.3)"
                              : "none",
                        }}
                      >
                        [{selectedChat.user.name.charAt(0)}]
                      </div>
                      <div
                        className="absolute -bottom-1 -right-1 w-3 h-3 border text-xs flex items-center justify-center"
                        style={{
                          backgroundColor: "#0d1117",
                          borderColor:
                            selectedChat.user.status === "online"
                              ? "#00ff88"
                              : selectedChat.user.status === "away"
                              ? "#ffaa00"
                              : "#6e7681",
                          color:
                            selectedChat.user.status === "online"
                              ? "#00ff88"
                              : selectedChat.user.status === "away"
                              ? "#ffaa00"
                              : "#6e7681",
                        }}
                      >
                        {selectedChat.user.status === "online"
                          ? "●"
                          : selectedChat.user.status === "away"
                          ? "◐"
                          : "○"}
                      </div>
                    </div>
                    <div>
                      {/* Terminal-style session info */}
                      <h3
                        className="font-semibold text-sm"
                        style={{ color: "#00e0ff" }}
                      >
                        ssh{" "}
                        {selectedChat.user.name.toLowerCase().replace(" ", "_")}
                        @coderspae
                      </h3>
                      <p className="text-xs" style={{ color: "#8b949e" }}>
                        [
                        {selectedChat.user.status === "online"
                          ? "CONNECTED"
                          : selectedChat.user.status === "away"
                          ? "IDLE"
                          : `LAST_SEEN: ${selectedChat.user.lastSeen}`}
                        ]
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Terminal-style action buttons */}
                    <button
                      className="px-3 py-1 text-xs font-mono border rounded transition-colors"
                      style={{
                        color: "#8b949e",
                        borderColor: "#30363d",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                        e.currentTarget.style.color = "#00e0ff";
                        e.currentTarget.style.borderColor = "#00e0ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#8b949e";
                        e.currentTarget.style.borderColor = "#30363d";
                      }}
                      title="Voice call"
                    >
                      [CALL]
                    </button>
                    <button
                      className="px-3 py-1 text-xs font-mono border rounded transition-colors"
                      style={{
                        color: "#8b949e",
                        borderColor: "#30363d",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                        e.currentTarget.style.color = "#00e0ff";
                        e.currentTarget.style.borderColor = "#00e0ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#8b949e";
                        e.currentTarget.style.borderColor = "#30363d";
                      }}
                      title="Video call"
                    >
                      [VIDEO]
                    </button>
                    <button
                      className="px-3 py-1 text-xs font-mono border rounded transition-colors"
                      style={{
                        color: "#8b949e",
                        borderColor: "#30363d",
                        backgroundColor: "transparent",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                        e.currentTarget.style.color = "#00e0ff";
                        e.currentTarget.style.borderColor = "#00e0ff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#8b949e";
                        e.currentTarget.style.borderColor = "#30363d";
                      }}
                      title="Options"
                    >
                      [OPTS]
                    </button>
                  </div>
                </div>

                {/* Terminal session info bar */}
                <div
                  className="mt-3 pt-2 border-t text-xs font-mono"
                  style={{ borderTopColor: "#30363d", color: "#6e7681" }}
                >
                  <div className="flex justify-between items-center">
                    <span>
                      SESSION: chat_{selectedChat.id} | ENCRYPTION: AES-256
                    </span>
                    <span>
                      MSGS: {selectedChat.messages.length} | LATENCY: ~2ms
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages Area - Only this scrolls */}
              <div className="flex-1 overflow-hidden flex flex-col">
                <div
                  className="flex-1 p-4 overflow-y-auto font-mono"
                  style={{ backgroundColor: "#0d1117" }}
                >
                  <div className="space-y-3 max-w-4xl mx-auto">
                    {selectedChat.messages.map((msg, index) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="flex flex-col max-w-xs lg:max-w-md">
                          {/* Terminal-like message header */}
                          <div
                            className={`text-xs px-3 py-1 ${
                              msg.isOwn ? "text-right" : "text-left"
                            }`}
                            style={{ color: "#6e7681" }}
                          >
                            {msg.isOwn
                              ? `> you@coderspae:~$ ${msg.time}`
                              : `> ${selectedChat?.user.name
                                  .toLowerCase()
                                  .replace(" ", "_")}@coderspae:~$ ${msg.time}`}
                          </div>

                          {/* Terminal-like message bubble */}
                          <div
                            className={`px-4 py-3 border font-mono text-sm ${
                              msg.isOwn
                                ? "rounded-r-sm rounded-l-lg"
                                : "rounded-l-sm rounded-r-lg"
                            }`}
                            style={{
                              backgroundColor: msg.isOwn
                                ? "#0969da"
                                : "#21262d",
                              borderColor: msg.isOwn ? "#1f6feb" : "#30363d",
                              color: msg.isOwn ? "#ffffff" : "#00e0ff",
                              fontFamily:
                                '"Fira Code", "JetBrains Mono", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                              boxShadow: msg.isOwn
                                ? "0 0 10px rgba(31, 111, 235, 0.3)"
                                : "0 0 10px rgba(0, 224, 255, 0.2)",
                            }}
                          >
                            {/* Terminal prompt for own messages */}
                            {msg.isOwn && (
                              <span style={{ color: "#7dd3fc", opacity: 0.8 }}>
                                $ echo &quot;{msg.text}&quot;
                                <br />
                              </span>
                            )}

                            {/* Message content */}
                            <span className="break-words whitespace-pre-wrap">
                              {msg.isOwn ? msg.text : `> ${msg.text}`}
                            </span>

                            {/* Terminal cursor for recent messages */}
                            {index === selectedChat.messages.length - 1 && (
                              <span
                                className="inline-block w-2 h-4 ml-1 animate-pulse"
                                style={{
                                  backgroundColor: msg.isOwn
                                    ? "#ffffff"
                                    : "#00e0ff",
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Terminal-like system message */}
                    <div className="flex justify-center my-6">
                      <div
                        className="px-4 py-2 rounded-lg text-xs font-mono border"
                        style={{
                          backgroundColor: "#161b22",
                          borderColor: "#30363d",
                          color: "#8b949e",
                        }}
                      >
                        ──── End of conversation ────
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message Input - Terminal Style */}
              <div
                className="p-4 border-t flex-shrink-0"
                style={{ backgroundColor: "#161b22", borderColor: "#30363d" }}
              >
                <div className="max-w-4xl mx-auto">
                  {/* Terminal prompt line */}
                  <div
                    className="flex items-center gap-2 font-mono text-sm mb-2"
                    style={{ color: "#8b949e" }}
                  >
                    <span style={{ color: "#00e0ff" }}>you@coderspae</span>
                    <span>:</span>
                    <span style={{ color: "#7dd3fc" }}>~/chat</span>
                    <span style={{ color: "#c9d1d9" }}>$</span>
                  </div>

                  {/* Input area */}
                  <div className="flex items-center gap-3">
                    <button
                      className="p-2 rounded-lg transition-colors font-mono text-sm"
                      style={{ color: "#8b949e", backgroundColor: "#21262d" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#30363d";
                        e.currentTarget.style.color = "#c9d1d9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                        e.currentTarget.style.color = "#8b949e";
                      }}
                      title="Attach file"
                    >
                      📎
                    </button>

                    <div
                      className="flex-1 flex items-center border rounded-lg px-4 py-3 font-mono"
                      style={{
                        backgroundColor: "#0d1117",
                        borderColor: "#30363d",
                        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <span style={{ color: "#00e0ff", marginRight: "8px" }}>
                        {">"}
                      </span>
                      <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="echo your message here..."
                        className="flex-1 bg-transparent focus:outline-none font-mono"
                        style={{ color: "#c9d1d9" }}
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleSendMessage()
                        }
                      />
                      {/* Blinking cursor */}
                      <span
                        className="inline-block w-2 h-4 ml-1 animate-pulse"
                        style={{ backgroundColor: "#00e0ff" }}
                      />
                    </div>

                    <button
                      className="p-2 rounded-lg transition-colors font-mono text-sm"
                      style={{ color: "#8b949e", backgroundColor: "#21262d" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#30363d";
                        e.currentTarget.style.color = "#c9d1d9";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                        e.currentTarget.style.color = "#8b949e";
                      }}
                      title="Emoji"
                    >
                      😊
                    </button>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="px-4 py-3 rounded-lg font-mono font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor: message.trim() ? "#0969da" : "#30363d",
                        color: message.trim() ? "#ffffff" : "#6e7681",
                        boxShadow: message.trim()
                          ? "0 0 10px rgba(9, 105, 218, 0.4)"
                          : "none",
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = "#1f6feb";
                          e.currentTarget.style.boxShadow =
                            "0 0 15px rgba(31, 111, 235, 0.6)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.backgroundColor = "#0969da";
                          e.currentTarget.style.boxShadow =
                            "0 0 10px rgba(9, 105, 218, 0.4)";
                        }
                      }}
                    >
                      SEND
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Empty State
            <div
              className="flex-1 flex items-center justify-center"
              style={{ backgroundColor: "#0d1117" }}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#c9d1d9" }}
                >
                  Select a conversation
                </h2>
                <p style={{ color: "#8b949e" }}>
                  Choose from your existing conversations or start a new one
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Terminal Style */}
        {rightSidebarOpen && selectedChat && (
          <div
            className="w-80 border-l flex flex-col h-full font-mono"
            style={{ backgroundColor: "#0d1117", borderColor: "#00e0ff" }}
          >
            {/* Terminal Sidebar Header */}
            <div
              className="p-4 border-b-2"
              style={{
                backgroundColor: "#161b22",
                borderBottomColor: "#00e0ff",
              }}
            >
              <div className="flex items-center justify-between">
                <h3
                  className="font-semibold text-sm"
                  style={{ color: "#00e0ff" }}
                >
                  [USER_INFO] - SESSION_DETAILS
                </h3>
                <button
                  onClick={() => setRightSidebarOpen(false)}
                  className="px-2 py-1 text-xs border rounded transition-colors"
                  style={{
                    color: "#8b949e",
                    borderColor: "#30363d",
                    backgroundColor: "transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "#ff6b6b";
                    e.currentTarget.style.borderColor = "#ff6b6b";
                    e.currentTarget.style.backgroundColor = "#21262d";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "#8b949e";
                    e.currentTarget.style.borderColor = "#30363d";
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  [X]
                </button>
              </div>
              {/* Terminal system info */}
              <div className="mt-2 text-xs" style={{ color: "#6e7681" }}>
                <div>SYSTEM: CoderspaE_Chat_v2.1</div>
                <div>UPTIME: {new Date().toLocaleTimeString()}</div>
              </div>
            </div>

            {/* Terminal User Info Section */}
            <div className="p-6 border-b" style={{ borderColor: "#30363d" }}>
              <div className="text-center">
                {/* Terminal-style user avatar */}
                <div
                  className="w-20 h-20 border-2 flex items-center justify-center text-xl font-bold mx-auto mb-3"
                  style={{
                    backgroundColor: "#21262d",
                    borderColor:
                      selectedChat.user.status === "online"
                        ? "#00e0ff"
                        : "#30363d",
                    color: "#c9d1d9",
                    boxShadow:
                      selectedChat.user.status === "online"
                        ? "0 0 15px rgba(0, 224, 255, 0.4)"
                        : "none",
                  }}
                >
                  [{selectedChat.user.name.charAt(0)}]
                </div>

                {/* Terminal user details */}
                <div className="space-y-2 text-left">
                  <div className="text-sm" style={{ color: "#8b949e" }}>
                    <span style={{ color: "#00e0ff" }}>USER:</span>{" "}
                    {selectedChat.user.name.toLowerCase().replace(" ", "_")}
                  </div>
                  <div className="text-sm" style={{ color: "#8b949e" }}>
                    <span style={{ color: "#00e0ff" }}>HOST:</span>{" "}
                    coderspae.com
                  </div>
                  <div className="text-sm" style={{ color: "#8b949e" }}>
                    <span style={{ color: "#00e0ff" }}>STATUS:</span>{" "}
                    <span
                      style={{
                        color:
                          selectedChat.user.status === "online"
                            ? "#00ff88"
                            : selectedChat.user.status === "away"
                            ? "#ffaa00"
                            : "#ff6b6b",
                      }}
                    >
                      {selectedChat.user.status === "online"
                        ? "[ONLINE]"
                        : selectedChat.user.status === "away"
                        ? "[AWAY]"
                        : `[OFFLINE - LAST_SEEN: ${selectedChat.user.lastSeen}]`}
                    </span>
                  </div>
                  {selectedChat.user.bio && (
                    <div className="text-sm mt-3" style={{ color: "#8b949e" }}>
                      <span style={{ color: "#00e0ff" }}>BIO:</span>{" "}
                      {selectedChat.user.bio}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Terminal Tab Navigation */}
            <div className="flex border-b" style={{ borderColor: "#30363d" }}>
              {[
                { id: "info", label: "INFO", icon: "[i]" },
                { id: "media", label: "MEDIA", icon: "[M]" },
                { id: "links", label: "LINKS", icon: "[L]" },
                { id: "settings", label: "CONFIG", icon: "[C]" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setRightSidebarTab(
                      tab.id as "info" | "media" | "links" | "settings"
                    )
                  }
                  className="flex-1 px-3 py-3 text-xs font-mono transition-colors border-b-2"
                  style={{
                    color: rightSidebarTab === tab.id ? "#00e0ff" : "#8b949e",
                    borderBottomColor:
                      rightSidebarTab === tab.id ? "#00e0ff" : "transparent",
                    backgroundColor:
                      rightSidebarTab === tab.id ? "#161b22" : "transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (rightSidebarTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = "#21262d";
                      e.currentTarget.style.color = "#c9d1d9";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (rightSidebarTab !== tab.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#8b949e";
                    }
                  }}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Terminal Tab Content */}
            <div className="flex-1 overflow-y-auto font-mono">
              {rightSidebarTab === "info" && (
                <div className="p-4 space-y-4">
                  {/* Terminal User Details */}
                  {selectedChat.user.badges &&
                    selectedChat.user.badges.length > 0 && (
                      <div>
                        <h4
                          className="font-medium mb-2 text-xs"
                          style={{ color: "#00e0ff" }}
                        >
                          [BADGES] ──────────────────
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedChat.user.badges.map((badge, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 text-xs border rounded font-mono"
                              style={{
                                backgroundColor: "#21262d",
                                borderColor: "#1f6feb",
                                color: "#1f6feb",
                              }}
                            >
                              [{badge}]
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  {selectedChat.user.joinDate && (
                    <div>
                      <h4
                        className="font-medium mb-2 text-xs"
                        style={{ color: "#00e0ff" }}
                      >
                        [MEMBER_SINCE] ────────────
                      </h4>
                      <p className="text-sm" style={{ color: "#8b949e" }}>
                        REGISTERED: {selectedChat.user.joinDate}
                      </p>
                    </div>
                  )}

                  <div>
                    <h4
                      className="font-medium mb-2 text-xs"
                      style={{ color: "#00e0ff" }}
                    >
                      [CHAT_STATS] ──────────────
                    </h4>
                    <div
                      className="space-y-2 text-sm"
                      style={{ color: "#8b949e" }}
                    >
                      <div className="flex justify-between font-mono">
                        <span>MESSAGES:</span>
                        <span style={{ color: "#00ff88" }}>
                          [{selectedChat.messages.length}]
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>LAST_MSG:</span>
                        <span style={{ color: "#00ff88" }}>
                          [{selectedChat.lastMessageTime}]
                        </span>
                      </div>
                      <div className="flex justify-between font-mono">
                        <span>SESSION_ID:</span>
                        <span style={{ color: "#00ff88" }}>
                          [chat_{selectedChat.id}]
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Terminal system info */}
                  <div
                    className="mt-6 p-3 border rounded"
                    style={{
                      borderColor: "#30363d",
                      backgroundColor: "#161b22",
                    }}
                  >
                    <h4
                      className="font-medium mb-2 text-xs"
                      style={{ color: "#ffaa00" }}
                    >
                      [SYSTEM_INFO] ─────────────
                    </h4>
                    <div
                      className="text-xs space-y-1"
                      style={{ color: "#6e7681" }}
                    >
                      <div>PROTOCOL: TCP/WEBSOCKET</div>
                      <div>ENCRYPTION: AES-256</div>
                      <div>LATENCY: ~2ms</div>
                      <div>PACKET_LOSS: 0%</div>
                    </div>
                  </div>
                </div>
              )}

              {rightSidebarTab === "media" && (
                <div className="p-4">
                  <h4
                    className="font-medium mb-3 text-xs"
                    style={{ color: "#00e0ff" }}
                  >
                    [MEDIA_FILES] ─────────────
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {/* Terminal-style media items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                      <div
                        key={item}
                        className="aspect-square border flex flex-col items-center justify-center cursor-pointer transition-colors font-mono text-xs"
                        style={{
                          backgroundColor: "#21262d",
                          borderColor: "#30363d",
                          color: "#8b949e",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#30363d";
                          e.currentTarget.style.borderColor = "#00e0ff";
                          e.currentTarget.style.color = "#c9d1d9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#21262d";
                          e.currentTarget.style.borderColor = "#30363d";
                          e.currentTarget.style.color = "#8b949e";
                        }}
                      >
                        <span className="text-lg">[IMG]</span>
                        <span className="text-xs mt-1">file_{item}.jpg</span>
                      </div>
                    ))}
                  </div>
                  <div
                    className="mt-4 p-2 border rounded text-center"
                    style={{
                      borderColor: "#30363d",
                      backgroundColor: "#161b22",
                    }}
                  >
                    <p
                      className="text-xs font-mono"
                      style={{ color: "#6e7681" }}
                    >
                      TOTAL_FILES: 0 | SIZE: 0 KB
                    </p>
                  </div>
                </div>
              )}

              {rightSidebarTab === "links" && (
                <div className="p-4">
                  <h4 className="font-medium mb-3" style={{ color: "#c9d1d9" }}>
                    Shared Links
                  </h4>
                  <div className="space-y-3">
                    {/* Sample links */}
                    {[
                      {
                        title: "GitHub Repository",
                        url: "github.com/example/repo",
                        time: "2 days ago",
                      },
                      {
                        title: "Documentation",
                        url: "docs.example.com",
                        time: "1 week ago",
                      },
                    ].map((link, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg cursor-pointer transition-colors"
                        style={{ backgroundColor: "#21262d" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "#30363d";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "#21262d";
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: "#1f6feb" }}
                          >
                            <span className="text-white">🔗</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5
                              className="font-medium truncate"
                              style={{ color: "#c9d1d9" }}
                            >
                              {link.title}
                            </h5>
                            <p
                              className="text-sm truncate"
                              style={{ color: "#8b949e" }}
                            >
                              {link.url}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: "#6e7681" }}
                            >
                              {link.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p
                    className="text-sm mt-3 text-center"
                    style={{ color: "#8b949e" }}
                  >
                    {/* No links shared yet */}
                  </p>
                </div>
              )}

              {rightSidebarTab === "settings" && (
                <div className="p-4 space-y-4">
                  <h4 className="font-medium mb-3" style={{ color: "#c9d1d9" }}>
                    Chat Settings
                  </h4>

                  {/* Notification Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#c9d1d9" }}>
                        Notifications
                      </span>
                      <button
                        className="w-10 h-6 rounded-full relative"
                        style={{ backgroundColor: "#1f6feb" }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 transition-transform"></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#c9d1d9" }}>
                        Sound
                      </span>
                      <button
                        className="w-10 h-6 rounded-full relative"
                        style={{ backgroundColor: "#30363d" }}
                      >
                        <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"></div>
                      </button>
                    </div>
                  </div>

                  {/* Chat Actions */}
                  <div
                    className="border-t pt-4 space-y-2"
                    style={{ borderColor: "#30363d" }}
                  >
                    <button
                      className="w-full p-3 text-left text-sm rounded-lg transition-colors"
                      style={{ color: "#c9d1d9" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      🔍 Search in Chat
                    </button>
                    <button
                      className="w-full p-3 text-left text-sm rounded-lg transition-colors"
                      style={{ color: "#c9d1d9" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      📁 Export Chat
                    </button>
                    <button
                      className="w-full p-3 text-left text-sm rounded-lg transition-colors"
                      style={{ color: "#c9d1d9" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#21262d";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      🔇 Mute Chat
                    </button>
                    <button
                      className="w-full p-3 text-left text-sm rounded-lg transition-colors"
                      style={{ color: "#f85149" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#490202";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      🚪 Leave Chat
                    </button>
                    <button
                      className="w-full p-3 text-left text-sm rounded-lg transition-colors"
                      style={{ color: "#f85149" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#490202";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      🗑️ Delete Chat
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}

        {/* Notification Overlay */}
        {notificationsOpen && (
          <div
            onClick={() => setNotificationsOpen(false)}
            className="fixed inset-0 z-40 bg-transparent"
          />
        )}
      </div>
    </div>
  );
}
