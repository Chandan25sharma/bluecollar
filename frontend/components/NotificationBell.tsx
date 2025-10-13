"use client";

import { useEffect, useState } from "react";
import { FiBell, FiCheck } from "react-icons/fi";
import { notificationsAPI } from "../lib/api";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  booking?: {
    id: string;
    service: {
      title: string;
    };
    provider: {
      name: string;
      user: {
        phone: string;
        email: string;
      };
    };
    client: {
      name: string;
      user: {
        phone: string;
        email: string;
      };
    };
    clientAddress?: string;
    clientLatitude?: number;
    clientLongitude?: number;
    acceptedAt?: string;
  };
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const res = await notificationsAPI.getUnreadCount();
      setUnreadCount(res.data.count);
    } catch (err) {
      console.error("Error fetching unread count:", err);
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsAPI.getNotifications();
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBellClick = () => {
    if (!showDropdown) {
      fetchNotifications();
    }
    setShowDropdown(!showDropdown);
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      fetchUnreadCount();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "BOOKING_ACCEPTED":
        return "✅";
      case "BOOKING_COMPLETED":
        return "🎉";
      case "BOOKING_CREATED":
        return "📋";
      case "BOOKING_CANCELLED":
        return "❌";
      default:
        return "🔔";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getGoogleMapsLink = (lat: number, lng: number) => {
    return `https://www.google.com/maps?q=${lat},${lng}&z=15`;
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowDropdown(false)}
          />

          {/* Dropdown Panel */}
          <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-semibold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiBell size={48} className="mx-auto mb-2 opacity-30" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-sm">
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-blue-600 hover:text-blue-700 flex-shrink-0"
                              title="Mark as read"
                            >
                              <FiCheck size={16} />
                            </button>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>

                        {/* Booking Details */}
                        {notification.booking && (
                          <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200 text-sm space-y-2">
                            <div className="font-medium text-gray-900">
                              {notification.booking.service.title}
                            </div>

                            {/* Provider Details (for clients) */}
                            {notification.type === "BOOKING_ACCEPTED" &&
                              notification.booking.acceptedAt && (
                                <div className="space-y-1 text-gray-700">
                                  <div className="font-medium text-green-700">
                                    ✅ Accepted by{" "}
                                    {notification.booking.provider.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span>📞</span>
                                    <a
                                      href={`tel:${notification.booking.provider.user.phone}`}
                                      className="text-blue-600 hover:underline"
                                    >
                                      {notification.booking.provider.user.phone}
                                    </a>
                                  </div>
                                  {notification.booking.clientLatitude &&
                                    notification.booking.clientLongitude && (
                                      <a
                                        href={getGoogleMapsLink(
                                          notification.booking.clientLatitude,
                                          notification.booking.clientLongitude
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-blue-600 hover:underline"
                                      >
                                        <span>📍</span>
                                        Track on Google Maps
                                      </a>
                                    )}
                                </div>
                              )}

                            {/* Client Location (for providers) */}
                            {notification.type === "BOOKING_CREATED" && (
                              <div className="space-y-1 text-gray-700">
                                <div>
                                  Client: {notification.booking.client.name}
                                </div>
                                {notification.booking.clientAddress && (
                                  <div className="text-sm">
                                    📍 {notification.booking.clientAddress}
                                  </div>
                                )}
                                {notification.booking.clientLatitude &&
                                  notification.booking.clientLongitude && (
                                    <a
                                      href={getGoogleMapsLink(
                                        notification.booking.clientLatitude,
                                        notification.booking.clientLongitude
                                      )}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
                                    >
                                      <span>🗺️</span>
                                      View Location
                                    </a>
                                  )}
                              </div>
                            )}
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-2">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
