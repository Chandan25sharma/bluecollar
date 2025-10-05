"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingsAPI, profileAPI, servicesAPI } from "../../../lib/api";
import { authUtils } from "../../../lib/auth";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
}

interface Booking {
  id: string;
  status: string;
  date: string;
  notes: string | null;
  totalAmount: number;
  distance?: number;
  clientAddress?: string;
  clientLatitude?: number;
  clientLongitude?: number;
  service: Service;
  client: {
    id: string;
    name: string;
    user?: {
      email: string;
      phone: string;
    };
  };
}

interface ProviderProfile {
  id: string;
  name: string;
  skills: string[];
  rate: number;
  verified: boolean;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "services"
  >("overview");

  useEffect(() => {
    // Check authentication
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authUtils.getUser();
    if (user?.role !== "PROVIDER") {
      router.push("/login");
      return;
    }

    // Fetch data
    fetchDashboardData();
  }, [router]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch provider profile
      const profileRes = await profileAPI.getProviderProfile();
      setProfile(profileRes.data);

      // Fetch bookings
      const bookingsRes = await bookingsAPI.getProviderBookings();
      setBookings(bookingsRes.data);

      // Fetch services
      const servicesRes = await servicesAPI.getMyServices();
      setServices(servicesRes.data);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, newStatus);
      // Refresh bookings after update
      const bookingsRes = await bookingsAPI.getProviderBookings();
      setBookings(bookingsRes.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update booking status");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
      case "IN-PROGRESS":
        return "bg-purple-100 text-purple-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    authUtils.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = {
    totalBookings: bookings.length,
    pendingBookings: bookings.filter((b) => b.status === "PENDING").length,
    completedBookings: bookings.filter((b) => b.status === "COMPLETED").length,
    totalEarnings: bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0),
    activeServices: services.filter((s) => s.isActive).length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Provider Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {profile?.name || "Provider"}!
                {profile?.verified ? (
                  <span className="ml-2 text-green-600">✓ Verified</span>
                ) : (
                  <span className="ml-2 text-yellow-600">⚠ Not Verified</span>
                )}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Pending Booking Requests Alert */}
      {stats.pendingBookings > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-yellow-400 animate-pulse"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-yellow-800">
                  You have {stats.pendingBookings} pending booking{" "}
                  {stats.pendingBookings === 1 ? "request" : "requests"} waiting
                  for your response!
                </p>
              </div>
              <button
                onClick={() => setActiveTab("bookings")}
                className="ml-auto px-4 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-colors"
              >
                View Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalBookings}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.pendingBookings}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <svg
                  className="w-6 h-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedBookings}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeServices}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <svg
                  className="w-6 h-6 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab("overview")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "bookings"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Bookings
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "services"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                My Services
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {booking.service.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Client: {booking.client.name}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDate(booking.date)}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                {booking.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.replace("_", " ")}
                            </span>
                            <p className="text-lg font-bold text-gray-900 mt-2">
                              ${booking.totalAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No bookings found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">
                              {booking.service.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              Client: {booking.client.name}
                            </p>
                            {booking.client.user?.email && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                📧 {booking.client.user.email}
                              </p>
                            )}
                            {booking.client.user?.phone && (
                              <p className="text-sm text-gray-500 mt-0.5">
                                📱 {booking.client.user.phone}
                              </p>
                            )}
                            <p className="text-sm text-gray-500 mt-1">
                              Date: {formatDate(booking.date)}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {booking.service.duration}
                            </p>
                            {booking.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">
                                Notes: {booking.notes}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status.replace("_", " ")}
                            </span>
                            <p className="text-lg font-bold text-gray-900 mt-2">
                              ${booking.totalAmount}
                            </p>
                          </div>
                        </div>

                        {/* Client Location Details */}
                        {booking.clientAddress && (
                          <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <div className="flex items-start gap-2">
                              <span className="text-blue-600 text-lg">📍</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  Service Location
                                </p>
                                <p className="text-sm text-gray-700 mt-1">
                                  {booking.clientAddress}
                                </p>
                                {booking.distance && (
                                  <p className="text-sm text-blue-600 font-medium mt-1">
                                    🚗 {booking.distance} km away
                                  </p>
                                )}
                                {booking.clientLatitude &&
                                  booking.clientLongitude && (
                                    <a
                                      href={`https://www.google.com/maps?q=${booking.clientLatitude},${booking.clientLongitude}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-block mt-2 text-xs text-blue-600 hover:text-blue-800 underline"
                                    >
                                      View on Google Maps →
                                    </a>
                                  )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Status update buttons */}
                        {booking.status === "PENDING" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking.id, "CONFIRMED")
                              }
                              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleStatusUpdate(booking.id, "CANCELLED")
                              }
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {booking.status === "CONFIRMED" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "IN_PROGRESS")
                            }
                            className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                          >
                            Start Work
                          </button>
                        )}

                        {booking.status === "IN_PROGRESS" && (
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "COMPLETED")
                            }
                            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">My Services</h3>
                  <Link
                    href="/dashboard/provider/services/new"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Add New Service
                  </Link>
                </div>
                {services.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">No services yet</p>
                    <Link
                      href="/dashboard/provider/services/new"
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Create Your First Service
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service) => (
                      <div
                        key={service.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {service.title}
                          </h4>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              service.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {service.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {service.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-500">
                              Category: {service.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              Duration: {service.duration}
                            </p>
                          </div>
                          <p className="text-lg font-bold text-gray-900">
                            ${service.price}
                          </p>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Link
                            href={`/dashboard/provider/services/${service.id}/edit`}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm text-center rounded hover:bg-blue-700"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={async () => {
                              try {
                                await servicesAPI.toggleServiceStatus(
                                  service.id
                                );
                                fetchDashboardData();
                              } catch (err) {
                                alert("Failed to toggle service status");
                              }
                            }}
                            className="flex-1 px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                          >
                            {service.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/provider/services"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Manage Services</h3>
                <p className="text-sm text-gray-600">
                  Add or edit your services
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/provider/profile"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">Edit your information</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/provider/payouts"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-full">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Payouts</h3>
                <p className="text-sm text-gray-600">View earnings & payouts</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
