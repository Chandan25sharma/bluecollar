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
  distance?: number;
  provider?: {
    id: string;
    name: string;
    businessName: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    distance?: number;
  };
}

interface Booking {
  id: string;
  status: string;
  date: string;
  notes: string;
  totalAmount: number;
  service: Service;
  provider: {
    id: string;
    name: string;
  };
}

interface ClientProfile {
  id: string;
  name: string;
  age: number | null;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  message: string;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Provider selection modal states
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [nearbyProviders, setNearbyProviders] = useState<any[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!authUtils.isAuthenticated()) {
      router.push("/login");
      return;
    }

    const user = authUtils.getUser();
    if (user?.role !== "CLIENT") {
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
      // Fetch client profile
      const profileRes = await profileAPI.getClientProfile();
      setProfile(profileRes.data);

      // Fetch bookings
      const bookingsRes = await bookingsAPI.getClientBookings();
      setBookings(bookingsRes.data);

      // Fetch available services
      const servicesRes = await servicesAPI.getServices();
      const activeServices = servicesRes.data.filter(
        (s: Service) => s.isActive
      );
      setServices(activeServices);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleBookService = async (service: Service) => {
    setSelectedService(service);

    // Check if client has location data
    if (!profile?.latitude || !profile?.longitude) {
      alert(
        "Please update your profile with your address to see nearby providers"
      );
      return;
    }

    setShowProviderModal(true);
    setLoadingProviders(true);

    try {
      // Fetch nearby providers for this service category
      const response = await servicesAPI.getNearbyServices(
        profile.latitude,
        profile.longitude,
        service.category
      );

      // Filter to only show providers for this specific service
      const providersForService = response.data.filter(
        (s: any) => s.id === service.id
      );

      setNearbyProviders(providersForService);
    } catch (err: any) {
      console.error("Error fetching nearby providers:", err);
      alert("Failed to load nearby providers");
      setShowProviderModal(false);
    } finally {
      setLoadingProviders(false);
    }
  };

  const handleSelectProvider = (providerId: string) => {
    if (selectedService) {
      router.push(`/booking/${selectedService.id}?providerId=${providerId}`);
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

  const filteredServices = services.filter(
    (s) =>
      (s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || s.category === selectedCategory)
  );

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
    totalSpent: bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((sum, b) => sum + b.totalAmount, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Client Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Welcome back, {profile?.name || "User"}!
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

      {/* Confirmed Bookings Alert */}
      {bookings.filter((b) => b.status === "CONFIRMED").length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  🎉 Great news! You have{" "}
                  {bookings.filter((b) => b.status === "CONFIRMED").length}{" "}
                  confirmed{" "}
                  {bookings.filter((b) => b.status === "CONFIRMED").length === 1
                    ? "booking"
                    : "bookings"}
                  . The provider will visit you at the scheduled time!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pending Bookings Info */}
      {bookings.filter((b) => b.status === "PENDING").length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-blue-400 animate-pulse"
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
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">
                  ⏳ You have{" "}
                  {bookings.filter((b) => b.status === "PENDING").length}{" "}
                  pending{" "}
                  {bookings.filter((b) => b.status === "PENDING").length === 1
                    ? "request"
                    : "requests"}{" "}
                  waiting for provider confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalSpent.toFixed(2)}
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
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab("services")}
                className={`px-6 py-3 text-sm font-medium ${
                  activeTab === "services"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Available Services
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Recent Bookings</h3>
                {bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
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
                    <p className="mt-4 text-gray-600">No bookings yet</p>
                    <button
                      onClick={() => setActiveTab("services")}
                      className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Browse Services
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking, index) => (
                      <div
                        key={booking.id}
                        className="bg-gradient-to-r from-white to-gray-50 border-l-4 rounded-lg p-5 hover:shadow-lg transition-all duration-300"
                        style={{
                          borderLeftColor:
                            booking.status === "PENDING"
                              ? "#FBBF24"
                              : booking.status === "CONFIRMED"
                              ? "#3B82F6"
                              : booking.status === "IN_PROGRESS"
                              ? "#A855F7"
                              : booking.status === "COMPLETED"
                              ? "#10B981"
                              : "#EF4444",
                          animation: `fadeInUp 0.5s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    booking.service.category === "Electrical"
                                      ? "bg-blue-100"
                                      : booking.service.category === "Plumbing"
                                      ? "bg-cyan-100"
                                      : booking.service.category === "Cleaning"
                                      ? "bg-green-100"
                                      : "bg-purple-100"
                                  }`}
                                >
                                  <span className="text-2xl">
                                    {booking.service.category ===
                                      "Electrical" && "⚡"}
                                    {booking.service.category === "Plumbing" &&
                                      "🚰"}
                                    {booking.service.category === "Cleaning" &&
                                      "🧹"}
                                    {booking.service.category === "Carpentry" &&
                                      "🛠️"}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg">
                                  {booking.service.title}
                                </h4>
                                <div className="flex items-center mt-1 text-sm text-gray-600">
                                  <svg
                                    className="w-4 h-4 mr-1"
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
                                  {booking.provider.name}
                                </div>
                                <div className="flex items-center mt-1 text-sm text-gray-500">
                                  <svg
                                    className="w-4 h-4 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                  </svg>
                                  {formatDate(booking.date)}
                                </div>
                                {booking.notes && (
                                  <p className="text-sm text-gray-600 mt-2 bg-blue-50 p-2 rounded italic border-l-2 border-blue-300">
                                    📝 {booking.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span
                              className={`inline-block px-4 py-2 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status === "IN_PROGRESS"
                                ? "IN PROGRESS"
                                : booking.status}
                            </span>
                            <p className="text-2xl font-bold text-green-600 mt-3">
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
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    All Bookings
                  </h3>
                  <div className="text-sm text-gray-600">
                    {bookings.length}{" "}
                    {bookings.length === 1 ? "booking" : "bookings"} total
                  </div>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <div className="text-6xl mb-4">📅</div>
                    <p className="text-gray-600 text-lg mb-2">
                      No bookings found
                    </p>
                    <p className="text-gray-500 text-sm mb-6">
                      Start booking services to see them here!
                    </p>
                    <button
                      onClick={() => setActiveTab("services")}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                    >
                      Browse Services →
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="bg-gradient-to-r from-white to-gray-50 border-l-4 rounded-lg p-5 hover:shadow-lg transition-all duration-300"
                        style={{
                          borderLeftColor:
                            booking.status === "PENDING"
                              ? "#FBBF24"
                              : booking.status === "CONFIRMED"
                              ? "#3B82F6"
                              : booking.status === "IN_PROGRESS"
                              ? "#A855F7"
                              : booking.status === "COMPLETED"
                              ? "#10B981"
                              : "#EF4444",
                          animation: `fadeInUp 0.5s ease-out ${
                            index * 0.1
                          }s both`,
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mr-3">
                                <div
                                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                    booking.service.category === "Electrical"
                                      ? "bg-blue-100"
                                      : booking.service.category === "Plumbing"
                                      ? "bg-cyan-100"
                                      : booking.service.category === "Cleaning"
                                      ? "bg-green-100"
                                      : "bg-purple-100"
                                  }`}
                                >
                                  <span className="text-2xl">
                                    {booking.service.category ===
                                      "Electrical" && "⚡"}
                                    {booking.service.category === "Plumbing" &&
                                      "🚰"}
                                    {booking.service.category === "Cleaning" &&
                                      "🧹"}
                                    {booking.service.category === "Carpentry" &&
                                      "🛠️"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-gray-900 text-lg mb-2">
                                  {booking.service.title}
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 mr-1"
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
                                    {booking.provider.name}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 mr-1"
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
                                    {booking.service.duration}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                      />
                                    </svg>
                                    {formatDate(booking.date)}
                                  </div>
                                  <div className="flex items-center text-sm text-gray-600">
                                    <svg
                                      className="w-4 h-4 mr-1"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                                      />
                                    </svg>
                                    {booking.service.category}
                                  </div>
                                </div>
                                {booking.notes && (
                                  <p className="text-sm text-gray-600 mt-3 bg-blue-50 p-3 rounded-lg italic border-l-2 border-blue-300">
                                    📝 <strong>Notes:</strong> {booking.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <span
                              className={`inline-block px-4 py-2 rounded-full text-xs font-bold shadow-sm ${getStatusColor(
                                booking.status
                              )}`}
                            >
                              {booking.status === "IN_PROGRESS"
                                ? "IN PROGRESS"
                                : booking.status}
                            </span>
                            <p className="text-2xl font-bold text-green-600 mt-3">
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

            {activeTab === "services" && (
              <div className="min-h-screen">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 mb-6">
                  <div className="max-w-4xl">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                      Discover Amazing{" "}
                      <span className="text-green-600">Services</span>
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Browse through our curated collection of professional
                      services. Book instantly and get your work done by
                      verified providers!
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Search for services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:border-green-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">
                    Filter by Category
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "all", name: "All Services", icon: "🏠" },
                      { id: "Electrical", name: "Electrical", icon: "⚡" },
                      { id: "Plumbing", name: "Plumbing", icon: "🚰" },
                      { id: "Cleaning", name: "Cleaning", icon: "🧹" },
                      { id: "Carpentry", name: "Carpentry", icon: "🛠️" },
                      { id: "HVAC", name: "HVAC", icon: "❄️" },
                      { id: "Painting", name: "Painting", icon: "🎨" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          selectedCategory === cat.id
                            ? "bg-green-600 text-white shadow-lg scale-105"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Services Grid */}
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">
                      Loading amazing services...
                    </p>
                  </div>
                ) : filteredServices.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-600 text-lg">
                      No services found matching your search
                    </p>
                    <button
                      onClick={() => {
                        setSearch("");
                        setSelectedCategory("all");
                      }}
                      className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <p className="text-sm text-gray-600">
                        Found{" "}
                        <span className="font-bold text-gray-900">
                          {filteredServices.length}
                        </span>{" "}
                        services
                        {selectedCategory !== "all" &&
                          ` in ${selectedCategory}`}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredServices.map((service, index) => (
                        <div
                          key={service.id}
                          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
                          style={{
                            animation: `fadeInUp 0.5s ease-out ${
                              index * 0.1
                            }s both`,
                          }}
                        >
                          {/* Service Header with Gradient */}
                          <div
                            className={`h-32 flex items-center justify-center text-white relative overflow-hidden ${
                              service.category === "Electrical"
                                ? "bg-gradient-to-br from-blue-400 to-purple-500"
                                : service.category === "Plumbing"
                                ? "bg-gradient-to-br from-blue-400 to-cyan-500"
                                : service.category === "Cleaning"
                                ? "bg-gradient-to-br from-green-400 to-teal-500"
                                : service.category === "Carpentry"
                                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                                : service.category === "HVAC"
                                ? "bg-gradient-to-br from-cyan-400 to-blue-500"
                                : "bg-gradient-to-br from-purple-400 to-pink-500"
                            }`}
                          >
                            <span className="text-5xl transform group-hover:scale-110 transition-transform">
                              {service.category === "Electrical" && "⚡"}
                              {service.category === "Plumbing" && "🚰"}
                              {service.category === "Cleaning" && "🧹"}
                              {service.category === "Carpentry" && "🛠️"}
                              {service.category === "HVAC" && "❄️"}
                              {service.category === "Painting" && "🎨"}
                            </span>
                            <div className="absolute top-2 right-2">
                              <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium">
                                {service.category}
                              </span>
                            </div>
                          </div>

                          {/* Service Content */}
                          <div className="p-5">
                            <h4 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
                              {service.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {service.description}
                            </p>

                            {/* Service Meta */}
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                              <div className="flex items-center text-sm text-gray-500">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                {service.duration}
                              </div>
                              <div className="text-2xl font-bold text-green-600">
                                ${service.price}
                              </div>
                            </div>

                            {/* Provider Info */}
                            {service.provider && (
                              <div className="flex items-center text-xs text-gray-500 mb-4">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                {service.provider.businessName}
                              </div>
                            )}

                            {/* Book Button */}
                            <button
                              onClick={() => handleBookService(service)}
                              className="block w-full text-center px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                            >
                              Book Now →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab("services")}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow text-left w-full"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">Browse Services</h3>
                <p className="text-sm text-gray-600">Find service providers</p>
              </div>
            </div>
          </button>

          <Link
            href="/dashboard/client/profile"
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
            href="/dashboard/client/reviews"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900">My Reviews</h3>
                <p className="text-sm text-gray-600">Rate your services</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Provider Selection Modal */}
      {showProviderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    {selectedService?.title}
                  </h2>
                  <p className="text-blue-100 mt-1">Select a nearby provider</p>
                </div>
                <button
                  onClick={() => setShowProviderModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {loadingProviders ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">
                    Finding nearby providers...
                  </p>
                </div>
              ) : nearbyProviders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">😔</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Providers Found
                  </h3>
                  <p className="text-gray-600">
                    No providers available for this service in your area.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Found {nearbyProviders.length} provider
                    {nearbyProviders.length !== 1 ? "s" : ""} nearby
                  </p>

                  {nearbyProviders.map(
                    (serviceProvider: any, index: number) => (
                      <div
                        key={index}
                        className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer"
                        onClick={() =>
                          handleSelectProvider(serviceProvider.provider.id)
                        }
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            {/* Provider Info */}
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                {serviceProvider.provider.name?.charAt(0) ||
                                  "P"}
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {serviceProvider.provider.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <svg
                                    className="w-4 h-4 text-green-600"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="font-semibold text-green-600">
                                    {serviceProvider.distance} km away
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Address */}
                            {serviceProvider.provider.address && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 mb-3">
                                <svg
                                  className="w-4 h-4 mt-0.5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                                <span>{serviceProvider.provider.address}</span>
                              </div>
                            )}

                            {/* Service Details */}
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">
                                  ⏱️ Duration:
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {selectedService?.duration}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-gray-500">💰 Price:</span>
                                <span className="font-semibold text-green-600">
                                  ${selectedService?.price}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Select Button */}
                          <div className="ml-4">
                            <button className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                              Select →
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
