"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Booking {
  id: string;
  service: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  date: string;
  provider: string;
  price: number;
  rating?: number;
}

interface Notification {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  time: string;
  read: boolean;
}

export default function ClientDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Mock data for demonstration
    const mockBookings: Booking[] = [
      {
        id: "1",
        service: "Electrical Wiring",
        status: "completed",
        date: "2023-10-15",
        provider: "John's Electrical Services",
        price: 120,
        rating: 5
      },
      {
        id: "2",
        service: "Plumbing Repair",
        status: "in-progress",
        date: "2023-10-20",
        provider: "Mike's Plumbing",
        price: 85
      },
      {
        id: "3",
        service: "Furniture Assembly",
        status: "confirmed",
        date: "2023-10-25",
        provider: "Handyman Services",
        price: 65
      },
      {
        id: "4",
        service: "Air Conditioning Service",
        status: "pending",
        date: "2023-11-01",
        provider: "Cool Air Experts",
        price: 99
      }
    ];

    const mockNotifications: Notification[] = [
      {
        id: "1",
        message: "Your booking with Mike's Plumbing has started",
        type: "info",
        time: "2 hours ago",
        read: false
      },
      {
        id: "2",
        message: "Payment for Electrical Wiring was successful",
        type: "success",
        time: "1 day ago",
        read: true
      },
      {
        id: "3",
        message: "Please rate your completed service",
        type: "warning",
        time: "2 days ago",
        read: false
      }
    ];

    setBookings(mockBookings);
    setNotifications(mockNotifications);
  }, []);

  const markNotificationAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
  };

  const statusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-yellow-100 text-yellow-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const notificationColor = (type: string) => {
    switch(type) {
      case "info": return "bg-blue-100 border-blue-300";
      case "success": return "bg-green-100 border-green-300";
      case "warning": return "bg-yellow-100 border-yellow-300";
      case "error": return "bg-red-100 border-red-300";
      default: return "bg-gray-100 border-gray-300";
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="ml-2 text-xl font-semibold text-gray-900">Client Dashboard</h1>
            </div>
            
            <div className="flex items-center">
              {/* Notifications */}
              <div className="relative mr-4">
                <button className="p-2 text-gray-600 hover:text-gray-900 relative">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {/* Notifications dropdown */}
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden z-10 hidden">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-center text-gray-500">No notifications</p>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`p-3 border-b border-gray-100 ${notificationColor(notification.type)} ${!notification.read ? 'font-medium' : ''}`}
                        >
                          <div className="flex justify-between">
                            <p className="text-sm">{notification.message}</p>
                            {!notification.read && (
                              <button 
                                onClick={() => markNotificationAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-800"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-200 text-center">
                    <Link href="/dashboard/client/notifications" className="text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* User profile */}
              <div className="relative">
                <button className="flex items-center text-sm rounded-full focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                    JD
                  </div>
                  <span className="ml-2 text-gray-700 hidden md:block">John Doe</span>
                  <svg className="ml-1 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Profile dropdown */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 hidden">
                  <Link href="/dashboard/client/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <div className="border-t border-gray-100"></div>
                  <Link href="/logout" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign out
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link 
              href="/dashboard/client" 
              className="block px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Overview
            </Link>
            <Link 
              href="/dashboard/client/bookings" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              My Bookings
            </Link>
            <Link 
              href="/dashboard/client/profile" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link 
              href="/dashboard/client/reviews" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Reviews
            </Link>
            <Link 
              href="/dashboard/client/payments" 
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setMobileMenuOpen(false)}
            >
              Payments
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Dashboard tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews
            </button>
          </nav>
        </div>

        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, John!</h1>
          <p className="text-gray-600">Here's what's happening with your bookings today.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Total Bookings</h2>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Completed</h2>
                <p className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === "completed").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">In Progress</h2>
                <p className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === "in-progress").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gray-100 text-gray-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Pending</h2>
                <p className="text-2xl font-bold">
                  {bookings.filter((b) => b.status === "pending").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Recent Bookings</h2>
              </div>
              <div className="overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by booking a new service.</p>
                    <div className="mt-6">
                      <Link
                        href="/services"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Book a Service
                      </Link>
                    </div>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <li key={booking.id} className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">{booking.service}</h3>
                            <p className="text-sm text-gray-500">with {booking.provider}</p>
                            <p className="text-sm text-gray-500">Scheduled for {booking.date}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                              {booking.status.replace("-", " ")}
                            </span>
                            <span className="text-lg font-semibold">${booking.price}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-3">
                          <Link
                            href={`/dashboard/client/bookings/${booking.id}`}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View Details
                          </Link>
                          {booking.status === "completed" && !booking.rating && (
                            <Link
                              href={`/dashboard/client/bookings/${booking.id}/review`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Add Review
                            </Link>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {bookings.length > 0 && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <Link
                    href="/dashboard/client/bookings"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center justify-center"
                  >
                    View all bookings
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Bookings & Quick Actions */}
          <div className="space-y-6">
            {/* Upcoming Bookings */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
              </div>
              <div className="p-6">
                {bookings.filter(b => b.status === "confirmed" || b.status === "pending").length === 0 ? (
                  <p className="text-sm text-gray-500">No upcoming bookings</p>
                ) : (
                  <ul className="space-y-4">
                    {bookings
                      .filter(b => b.status === "confirmed" || b.status === "pending")
                      .slice(0, 3)
                      .map(booking => (
                        <li key={booking.id} className="flex justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.service}</p>
                            <p className="text-xs text-gray-500">{booking.date}</p>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </li>
                      ))
                    }
                  </ul>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
              </div>
              <div className="p-6 space-y-4">
                <Link
                  href="/services"
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Book a New Service</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </Link>
                <Link
                  href="/dashboard/client/payments"
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Payment Methods</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </Link>
                <Link
                  href="/support"
                  className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <span>Contact Support</span>
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}