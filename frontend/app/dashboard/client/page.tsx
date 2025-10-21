"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientHeader from "../../../components/ClientHeader";
import DashboardFooter from "../../../components/DashboardFooter";
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
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-16 md:pb-0">
        {error && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Compact Mobile Hero Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-4">
          <div className="relative bg-gradient-to-br from-green-500 via-green-600 to-emerald-700 rounded-2xl overflow-hidden mb-6">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-white/10"></div>

            <div className="relative p-4 md:p-8">
              <div className="text-center md:text-left">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 mb-3 text-xs">
                  <span className="w-2 h-2 bg-green-300 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-white font-medium">Live Platform</span>
                </div>

                <h1 className="text-xl md:text-3xl font-bold text-white mb-3 leading-tight">
                  Welcome back,{" "}
                  <span className="text-green-200">
                    {profile?.name ? profile.name.split(" ")[0] : "Client"}
                  </span>
                  !
                </h1>

                <p className="text-sm md:text-lg text-green-100 mb-4">
                  Your gateway to premium home services
                </p>

                {/* Mobile Stats Grid */}
                <div className="grid grid-cols-4 gap-2 md:gap-4 mt-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-white">
                      {stats.totalBookings}
                    </div>
                    <div className="text-green-200 text-xs">Total</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-white">
                      {stats.completedBookings}
                    </div>
                    <div className="text-green-200 text-xs">Done</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-white">
                      {stats.pendingBookings}
                    </div>
                    <div className="text-green-200 text-xs">Pending</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-center">
                    <div className="text-lg md:text-2xl font-bold text-white">
                      4.9
                    </div>
                    <div className="text-green-200 text-xs">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Quick Actions */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-6">
          <div className="grid grid-cols-3 gap-3">
            {/* Browse Services */}
            <Link
              href="/dashboard/client/Services"
              className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 md:p-4 hover:shadow-lg transition-all duration-300 border border-blue-200"
            >
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
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
                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-1">
                  Browse
                </h3>
                <p className="text-xs text-gray-600 hidden md:block">
                  Services
                </p>
              </div>
            </Link>

            {/* My Bookings */}
            <Link
              href="/dashboard/client/bookings"
              className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 md:p-4 hover:shadow-lg transition-all duration-300 border border-green-200"
            >
              {stats.pendingBookings > 0 && (
                <div className="absolute -top-1 -right-1">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {stats.pendingBookings}
                    </span>
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
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
                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-1">
                  Bookings
                </h3>
                <p className="text-xs text-gray-600 hidden md:block">History</p>
              </div>
            </Link>

            {/* Profile */}
            <Link
              href="/dashboard/client/profile"
              className="group bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 md:p-4 hover:shadow-lg transition-all duration-300 border border-purple-200"
            >
              <div className="text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-5 h-5 md:w-6 md:h-6 text-white"
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
                <h3 className="text-xs md:text-sm font-bold text-gray-900 mb-1">
                  Profile
                </h3>
                <p className="text-xs text-gray-600 hidden md:block">
                  Settings
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Compact Featured Services */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">
              Popular Services
            </h2>
            <p className="text-sm text-gray-600">Most requested by clients</p>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              {
                name: "Electrical",
                icon: "⚡",
                color: "from-blue-500 to-blue-600",
              },
              {
                name: "Plumbing",
                icon: "🚰",
                color: "from-cyan-500 to-cyan-600",
              },
              {
                name: "Cleaning",
                icon: "🧹",
                color: "from-green-500 to-green-600",
              },
              {
                name: "Carpentry",
                icon: "🛠️",
                color: "from-orange-500 to-orange-600",
              },
            ].map((service, index) => (
              <div
                key={service.name}
                className="group bg-white rounded-xl p-3 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-2 mx-auto group-hover:scale-110 transition-transform`}
                >
                  <span className="text-lg md:text-xl">{service.icon}</span>
                </div>

                <h3 className="text-xs md:text-sm font-bold text-gray-900 text-center mb-1">
                  {service.name}
                </h3>

                <button className="w-full bg-gray-50 hover:bg-green-50 text-gray-700 hover:text-green-600 py-1 px-2 rounded-lg transition-all text-xs">
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Status Alerts */}
        {(bookings.filter((b) => b.status === "CONFIRMED").length > 0 ||
          bookings.filter((b) => b.status === "PENDING").length > 0) && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 mb-4">
            <div className="space-y-2">
              {/* Confirmed Bookings */}
              {bookings.filter((b) => b.status === "CONFIRMED").length > 0 && (
                <div className="bg-green-50 border-l-4 border-green-400 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-4 w-4 text-green-400"
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
                    <div className="ml-2">
                      <p className="text-xs md:text-sm font-medium text-green-800">
                        🎉{" "}
                        {
                          bookings.filter((b) => b.status === "CONFIRMED")
                            .length
                        }{" "}
                        confirmed booking
                        {bookings.filter((b) => b.status === "CONFIRMED")
                          .length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pending Bookings */}
              {bookings.filter((b) => b.status === "PENDING").length > 0 && (
                <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-4 w-4 text-blue-400 animate-pulse"
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
                    <div className="ml-2">
                      <p className="text-xs md:text-sm font-medium text-blue-800">
                        ⏳{" "}
                        {bookings.filter((b) => b.status === "PENDING").length}{" "}
                        pending request
                        {bookings.filter((b) => b.status === "PENDING")
                          .length !== 1
                          ? "s"
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Compact Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4">
          <div className="bg-white p-1 rounded-xl shadow-lg border border-gray-100 mb-4">
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "overview"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>📊</span>
                  <span className="hidden md:inline">Overview</span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`flex-1 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "bookings"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>�</span>
                  <span className="hidden md:inline">Bookings</span>
                  {stats.pendingBookings > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full">
                      {stats.pendingBookings}
                    </span>
                  )}
                </div>
              </button>

              <button
                onClick={() => setActiveTab("services")}
                className={`flex-1 px-3 py-2 text-xs md:text-sm font-semibold rounded-lg transition-all duration-300 ${
                  activeTab === "services"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <span>🔍</span>
                  <span className="hidden md:inline">Services</span>
                </div>
              </button>
            </nav>
          </div>

          {/* Compact Tab Content */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-3 md:p-6">
              {activeTab === "overview" && (
                <div>
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-900">
                      📋 Recent Bookings
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      Last 3
                    </span>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg">
                      <div className="text-3xl md:text-4xl mb-2">📅</div>
                      <p className="text-gray-600 text-sm mb-2">
                        No bookings yet
                      </p>
                      <p className="text-gray-500 text-xs mb-3">
                        Start your service journey!
                      </p>
                      <button
                        onClick={() => setActiveTab("services")}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium"
                      >
                        🔍 Browse Services
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      {bookings.slice(0, 3).map((booking, index) => (
                        <div
                          key={booking.id}
                          className="bg-white border-l-4 rounded-lg p-3 hover:shadow-md transition-all border border-gray-100"
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
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-start gap-2">
                                <div className="flex-shrink-0">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                      booking.service.category === "Electrical"
                                        ? "bg-blue-100"
                                        : booking.service.category ===
                                          "Plumbing"
                                        ? "bg-cyan-100"
                                        : booking.service.category ===
                                          "Cleaning"
                                        ? "bg-green-100"
                                        : "bg-purple-100"
                                    }`}
                                  >
                                    <span className="text-sm">
                                      {booking.service.category ===
                                        "Electrical" && "⚡"}
                                      {booking.service.category ===
                                        "Plumbing" && "🚰"}
                                      {booking.service.category ===
                                        "Cleaning" && "🧹"}
                                      {booking.service.category ===
                                        "Carpentry" && "🛠️"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-gray-900 text-sm truncate">
                                    {booking.service.title}
                                  </h4>
                                  <div className="flex items-center mt-1 text-xs text-gray-600">
                                    <span className="mr-1">👤</span>
                                    <span className="truncate">
                                      {booking.provider.name}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  booking.status
                                )}`}
                              >
                                {booking.status === "IN_PROGRESS"
                                  ? "IN PROGRESS"
                                  : booking.status}
                              </span>
                              <p className="text-sm font-bold text-green-600 mt-1">
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
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-2">
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                      📋 All Bookings
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs md:text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                        {bookings.length}{" "}
                        {bookings.length === 1 ? "booking" : "bookings"}
                      </span>
                    </div>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 md:py-12 bg-gray-50 rounded-xl">
                      <div className="text-4xl md:text-6xl mb-3 md:mb-4">
                        📅
                      </div>
                      <p className="text-gray-600 text-sm md:text-lg mb-2">
                        No bookings found
                      </p>
                      <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-6">
                        Start booking services to see them here!
                      </p>
                      <button
                        onClick={() => setActiveTab("services")}
                        className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg md:rounded-xl hover:shadow-lg transition-all text-sm md:text-base font-medium"
                      >
                        🔍 Browse Services →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 md:space-y-4">
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
                                        : booking.service.category ===
                                          "Plumbing"
                                        ? "bg-cyan-100"
                                        : booking.service.category ===
                                          "Cleaning"
                                        ? "bg-green-100"
                                        : "bg-purple-100"
                                    }`}
                                  >
                                    <span className="text-2xl">
                                      {booking.service.category ===
                                        "Electrical" && "⚡"}
                                      {booking.service.category ===
                                        "Plumbing" && "🚰"}
                                      {booking.service.category ===
                                        "Cleaning" && "🧹"}
                                      {booking.service.category ===
                                        "Carpentry" && "🛠️"}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-900 text-lg mb-2">
                                    {booking.service.title}
                                  </h4>
                                  <div className="grid grid-cols-3 gap-3">
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
                <div>
                  {/* Compact Hero Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4 md:p-6 mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-3">
                      🔍 Discover{" "}
                      <span className="text-green-600">Services</span>
                    </h2>
                    <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
                      Browse professional services and book instantly!
                    </p>

                    {/* Compact Search Bar */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-400">🔍</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Search services..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 md:py-3 bg-white border border-gray-200 rounded-lg md:rounded-xl focus:outline-none focus:border-green-500 text-sm md:text-base"
                      />
                    </div>
                  </div>

                  {/* Compact Category Filter */}
                  <div className="mb-4 md:mb-6">
                    <h3 className="text-xs md:text-sm font-semibold text-gray-700 mb-2 md:mb-3">
                      CATEGORIES
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: "all", name: "All", icon: "🏠" },
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
                          className={`px-2 md:px-3 py-1 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                            selectedCategory === cat.id
                              ? "bg-green-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                          }`}
                        >
                          <span className="mr-1">{cat.icon}</span>
                          <span className="hidden md:inline">{cat.name}</span>
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

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {filteredServices.map((service, index) => (
                          <div
                            key={service.id}
                            className="group relative bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 overflow-hidden"
                            style={{
                              animation: `fadeInUp 0.3s ease-out ${
                                index * 0.05
                              }s both`,
                            }}
                          >
                            {/* Service Card Header */}
                            <div className="p-6 pb-4">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  {/* Category Icon */}
                                  <div
                                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm ${
                                      service.category === "Electrical"
                                        ? "bg-blue-500"
                                        : service.category === "Plumbing"
                                        ? "bg-cyan-500"
                                        : service.category === "Cleaning"
                                        ? "bg-green-500"
                                        : service.category === "Carpentry"
                                        ? "bg-orange-500"
                                        : service.category === "HVAC"
                                        ? "bg-indigo-500"
                                        : "bg-purple-500"
                                    }`}
                                  >
                                    <span className="text-xl">
                                      {service.category === "Electrical" &&
                                        "⚡"}
                                      {service.category === "Plumbing" && "🚰"}
                                      {service.category === "Cleaning" && "🧹"}
                                      {service.category === "Carpentry" && "🛠️"}
                                      {service.category === "HVAC" && "❄️"}
                                      {service.category === "Painting" && "🎨"}
                                    </span>
                                  </div>

                                  {/* Service Info */}
                                  <div className="flex-1">
                                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-green-600 transition-colors">
                                      {service.title}
                                    </h4>
                                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                                      {service.category}
                                    </span>
                                  </div>
                                </div>

                                {/* Price Badge */}
                                <div className="text-right">
                                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg">
                                    <span className="text-xl font-bold">
                                      ${service.price}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Description */}
                              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                                {service.description}
                              </p>

                              {/* Service Details */}
                              <div className="space-y-2 mb-5">
                                <div className="flex items-center text-sm text-gray-500">
                                  <svg
                                    className="w-4 h-4 mr-2 text-gray-400"
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
                                  <span className="font-medium">Duration:</span>
                                  <span className="ml-1">
                                    {service.duration}
                                  </span>
                                </div>

                                {service.provider && (
                                  <div className="flex items-center text-sm text-gray-500">
                                    <svg
                                      className="w-4 h-4 mr-2 text-gray-400"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                      />
                                    </svg>
                                    <span className="font-medium">
                                      Provider:
                                    </span>
                                    <span className="ml-1 text-blue-600">
                                      {service.provider.businessName}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Book Button */}
                              <button
                                onClick={() => handleBookService(service)}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] hover:shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                              >
                                <span>Book Service</span>
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                  />
                                </svg>
                              </button>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
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
                    <p className="text-blue-100 mt-1">
                      Select a nearby provider
                    </p>
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
                                  <span>
                                    {serviceProvider.provider.address}
                                  </span>
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
                                  <span className="text-gray-500">
                                    💰 Price:
                                  </span>
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

        <DashboardFooter userType="client" />
      </div>
    </>
  );
}
