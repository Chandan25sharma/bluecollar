"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProviderHeader from "../../../components/ProviderHeader";
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
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
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
    <>
      <ProviderHeader />
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}
        {/* Welcome Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-8 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  Welcome back, {profile?.name || "Provider"}!
                </h1>
                <p className="text-green-100 text-lg">
                  {profile?.verified ? (
                    <>✓ Verified Provider - Ready to accept bookings</>
                  ) : (
                    <>⚠ Complete verification to start accepting bookings</>
                  )}
                </p>
                {stats.pendingBookings > 0 && (
                  <p className="text-yellow-200 font-medium mt-2">
                    🔔 You have {stats.pendingBookings} pending booking{" "}
                    {stats.pendingBookings === 1 ? "request" : "requests"}!
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  ${stats.totalEarnings.toFixed(2)}
                </p>
                <p className="text-green-100">Total Earnings</p>
              </div>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/dashboard/provider/bookings"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
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
                <h3 className="font-semibold text-gray-900">Manage Bookings</h3>
                <p className="text-sm text-gray-500">View & update bookings</p>
                {stats.pendingBookings > 0 && (
                  <span className="inline-block mt-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                    {stats.pendingBookings} pending
                  </span>
                )}
              </div>
            </Link>

            <Link
              href="/dashboard/provider/services"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
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
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">My Services</h3>
                <p className="text-sm text-gray-500">Edit services & pricing</p>
              </div>
            </Link>

            <Link
              href="/dashboard/provider/payouts"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Payouts</h3>
                <p className="text-sm text-gray-500">Track earnings</p>
              </div>
            </Link>

            <Link
              href="/dashboard/provider/profile"
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className="text-center">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-3">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-500">Update info & skills</p>
              </div>
            </Link>
          </div>
        </div>{" "}
        {/* Stats Cards */}
      </div>
    </>
  );
}
