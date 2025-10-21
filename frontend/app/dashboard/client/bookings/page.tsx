"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ClientHeader from "../../../../components/ClientHeader";
import DashboardFooter from "../../../../components/DashboardFooter";
import { bookingsAPI } from "../../../../lib/api";

interface Booking {
  id: string;
  status:
    | "PENDING_PAYMENT"
    | "PENDING"
    | "ACCEPTED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED";
  date: string;
  clientAddress: string;
  clientLatitude?: number;
  clientLongitude?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    title: string;
    price: number;
    duration: string;
    category: string;
  };
  provider: {
    id: string;
    businessName: string;
    rating: number;
    user: {
      email: string;
      phone: string;
    };
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
  };
}

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        const response = await bookingsAPI.getClientBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "PENDING":
        return "bg-indigo-100 text-indigo-800";
      case "PENDING_PAYMENT":
        return "bg-orange-100 text-orange-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <svg
            className="w-5 h-5 mr-2"
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
        );
      case "CONFIRMED":
        return (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );
      case "IN_PROGRESS":
        return (
          <svg
            className="w-5 h-5 mr-2"
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
        );
      case "PENDING":
        return (
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "CANCELLED":
        return (
          <svg
            className="w-5 h-5 mr-2"
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
        );
      default:
        return (
          <svg
            className="w-5 h-5 mr-2"
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
        );
    }
  };

  const filteredBookings = bookings.filter(
    (booking) => filter === "all" || booking.status === filter
  );

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "date-desc") {
      return (
        new Date(b.date || b.createdAt).getTime() -
        new Date(a.date || a.createdAt).getTime()
      );
    } else if (sortBy === "date-asc") {
      return (
        new Date(a.date || a.createdAt).getTime() -
        new Date(b.date || b.createdAt).getTime()
      );
    } else if (sortBy === "price-desc") {
      return b.service.price - a.service.price;
    } else if (sortBy === "price-asc") {
      return a.service.price - b.service.price;
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusCount = (status: string) => {
    return bookings.filter((booking) => booking.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <div className="h-10 bg-gray-200 rounded-md w-40 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-lg p-4 h-24 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"
              ></div>
            ))}
          </div>
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-20 bg-gray-100 rounded-lg animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 pb-20 md:pb-6">
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                My Bookings
              </h1>
              <p className="text-gray-600">
                Manage and track all your service bookings
              </p>
            </div>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-sm hover:shadow-md"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Book New Service
            </Link>
          </div>

          {/* Stats Overview - Improved Mobile Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                    Total
                  </h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {bookings.length}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
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

            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                    Upcoming
                  </h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {getStatusCount("CONFIRMED") +
                      getStatusCount("PENDING") +
                      getStatusCount("IN_PROGRESS")}
                  </p>
                </div>
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-yellow-600"
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

            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                    Completed
                  </h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {getStatusCount("COMPLETED")}
                  </p>
                </div>
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
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

            <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-red-500 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs md:text-sm font-medium text-gray-500 mb-1">
                    Cancelled
                  </h3>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">
                    {getStatusCount("CANCELLED")}
                  </p>
                </div>
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600"
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
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Sorting - Mobile-First Design */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            {/* Filter Pills */}
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "all"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All{" "}
                  <span className="ml-1 opacity-75">({bookings.length})</span>
                </button>
                <button
                  onClick={() => setFilter("PENDING_PAYMENT")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "PENDING_PAYMENT"
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Payment{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("PENDING_PAYMENT")})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("PENDING")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "PENDING"
                      ? "bg-indigo-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="hidden md:inline">Awaiting</span> Approval{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("PENDING")})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("ACCEPTED")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "ACCEPTED"
                      ? "bg-blue-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Confirmed{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("ACCEPTED")})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("IN_PROGRESS")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "IN_PROGRESS"
                      ? "bg-yellow-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Active{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("IN_PROGRESS")})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("COMPLETED")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "COMPLETED"
                      ? "bg-green-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Done{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("COMPLETED")})
                  </span>
                </button>
                <button
                  onClick={() => setFilter("CANCELLED")}
                  className={`px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition-all ${
                    filter === "CANCELLED"
                      ? "bg-red-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancelled{" "}
                  <span className="ml-1 opacity-75">
                    ({getStatusCount("CANCELLED")})
                  </span>
                </button>
              </div>
            </div>

            {/* Sort and Results Count */}
            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-3">
                <label
                  htmlFor="sort"
                  className="text-sm font-medium text-gray-700 whitespace-nowrap"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 md:w-auto pl-3 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="date-desc">Newest First</option>
                  <option value="date-asc">Oldest First</option>
                  <option value="price-desc">Price High → Low</option>
                  <option value="price-asc">Price Low → High</option>
                </select>
              </div>

              <div className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                <span className="font-medium">{sortedBookings.length}</span> of{" "}
                <span className="font-medium">{bookings.length}</span> bookings
              </div>
            </div>
          </div>

          {/* Bookings List - Card-Based Mobile Design */}
          <div className="space-y-4">
            {sortedBookings.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  {filter === "all"
                    ? "You haven't made any bookings yet. Start by booking your first service!"
                    : `No ${filter
                        .toLowerCase()
                        .replace(
                          "_",
                          " "
                        )} bookings found. Try a different filter.`}
                </p>
                <Link
                  href="/services"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Book Your First Service
                </Link>
              </div>
            ) : (
              sortedBookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both`,
                  }}
                >
                  {/* Mobile Layout */}
                  <div className="block md:hidden">
                    <div className="p-4">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-base leading-tight">
                            {booking.service.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {booking.provider.businessName}
                          </p>
                        </div>
                        <span
                          className={`ml-3 px-2 py-1 rounded-lg text-xs font-medium ${statusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status.replace("_", " ")}
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div className="flex items-center text-gray-600">
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
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(booking.date)}
                        </div>
                        <div className="flex items-center text-gray-600">
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
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="font-semibold text-green-600">
                            ${booking.service.price}
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-start text-sm text-gray-600 mb-4">
                        <svg
                          className="w-4 h-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0"
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
                        </svg>
                        <span className="line-clamp-2">
                          {booking.clientAddress}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/client/bookings/${booking.id}`}
                          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg font-medium hover:bg-gray-200 transition-colors"
                        >
                          View Details
                        </Link>
                        {booking.status === "COMPLETED" && (
                          <Link
                            href={`/dashboard/client/bookings/${booking.id}/review`}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-colors"
                          >
                            Add Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:block">
                    <div className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {booking.service.title}
                            </h3>
                            <span
                              className={`ml-3 inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium ${statusColor(
                                booking.status
                              )}`}
                            >
                              {statusIcon(booking.status)}
                              {booking.status.replace("_", " ")}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
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
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                              {booking.provider.businessName}
                            </div>

                            <div className="flex items-center">
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
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {formatDate(booking.date)}
                            </div>

                            <div className="flex items-center">
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
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                              </svg>
                              <span className="truncate">
                                {booking.clientAddress}
                              </span>
                            </div>

                            <div className="flex items-center">
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
                                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                              <span className="font-semibold text-green-600">
                                ${booking.service.price}
                              </span>
                              <span className="mx-1">•</span>
                              <span>{booking.service.duration}</span>
                            </div>
                          </div>
                        </div>

                        <div className="ml-6 flex space-x-3">
                          <Link
                            href={`/dashboard/client/bookings/${booking.id}`}
                            className="px-4 py-2 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors"
                          >
                            View Details
                          </Link>
                          {booking.status === "COMPLETED" && (
                            <Link
                              href={`/dashboard/client/bookings/${booking.id}/review`}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                              Add Review
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <DashboardFooter userType="client" />
    </>
  );
}
