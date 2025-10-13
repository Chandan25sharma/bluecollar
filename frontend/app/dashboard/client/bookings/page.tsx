"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ClientHeader from "../../../../components/ClientHeader";

interface Booking {
  id: string;
  service: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  date: string;
  provider: string;
  price: number;
  rating?: number;
  address: string;
  duration: string;
}

export default function ClientBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate API call with mock data
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Mock data - in real app, this would come from API
        const mockBookings: Booking[] = [
          {
            id: "1",
            service: "Electrical Wiring Installation",
            status: "completed",
            date: "2023-10-15",
            provider: "John's Electrical Services",
            price: 250,
            rating: 5,
            address: "123 Main St, Apt 4B",
            duration: "3 hours",
          },
          {
            id: "2",
            service: "Kitchen Plumbing Repair",
            status: "in-progress",
            date: "2023-10-20",
            provider: "Mike's Plumbing",
            price: 120,
            address: "123 Main St, Apt 4B",
            duration: "2 hours",
          },
          {
            id: "3",
            service: "Furniture Assembly",
            status: "confirmed",
            date: "2023-10-25",
            provider: "Handyman Services",
            price: 85,
            address: "123 Main St, Apt 4B",
            duration: "1.5 hours",
          },
          {
            id: "4",
            service: "Air Conditioning Service",
            status: "pending",
            date: "2023-11-01",
            provider: "Cool Air Experts",
            price: 99,
            address: "123 Main St, Apt 4B",
            duration: "2 hours",
          },
          {
            id: "5",
            service: "Deep Cleaning Service",
            status: "cancelled",
            date: "2023-09-10",
            provider: "CleanPro",
            price: 150,
            address: "123 Main St, Apt 4B",
            duration: "4 hours",
          },
          {
            id: "6",
            service: "TV Mounting",
            status: "completed",
            date: "2023-09-28",
            provider: "Install Experts",
            price: 75,
            rating: 4,
            address: "123 Main St, Apt 4B",
            duration: "1 hour",
          },
        ];

        setBookings(mockBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
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
      case "confirmed":
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
      case "in-progress":
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
      case "pending":
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
      case "cancelled":
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
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "date-asc") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "price-desc") {
      return b.price - a.price;
    } else if (sortBy === "price-asc") {
      return a.price - b.price;
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <Link
              href="/services"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
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

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
              <h3 className="text-sm font-medium text-gray-500">
                Total Bookings
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {bookings.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("confirmed") +
                  getStatusCount("pending") +
                  getStatusCount("in-progress")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("completed")}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
              <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
              <p className="text-2xl font-bold text-gray-900">
                {getStatusCount("cancelled")}
              </p>
            </div>
          </div>

          {/* Filters and Sorting */}
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "all"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                All ({bookings.length})
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "pending"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Pending ({getStatusCount("pending")})
              </button>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "confirmed"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Confirmed ({getStatusCount("confirmed")})
              </button>
              <button
                onClick={() => setFilter("in-progress")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "in-progress"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                In Progress ({getStatusCount("in-progress")})
              </button>
              <button
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Completed ({getStatusCount("completed")})
              </button>
              <button
                onClick={() => setFilter("cancelled")}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  filter === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                Cancelled ({getStatusCount("cancelled")})
              </button>
            </div>

            <div className="p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <label
                  htmlFor="sort"
                  className="mr-2 text-sm font-medium text-gray-700"
                >
                  Sort by:
                </label>
                <select
                  id="sort"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="price-desc">Price (High to Low)</option>
                  <option value="price-asc">Price (Low to High)</option>
                </select>
              </div>

              <div className="text-sm text-gray-500">
                Showing {sortedBookings.length} of {bookings.length} bookings
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {sortedBookings.length === 0 ? (
              <div className="p-12 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter === "all"
                    ? "You haven't made any bookings yet."
                    : `You don't have any ${filter} bookings.`}
                </p>
                <div className="mt-6">
                  <Link
                    href="/services"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="-ml-1 mr-2 h-5 w-5"
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
                    Book a Service
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            {booking.service}
                          </h3>
                          <span
                            className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor(
                              booking.status
                            )}`}
                          >
                            {statusIcon(booking.status)}
                            {booking.status.replace("-", " ")}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                            {booking.provider}
                          </div>

                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
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
                            {booking.address}
                          </div>

                          <div className="flex items-center">
                            <svg
                              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            ${booking.price} • {booking.duration}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 md:mt-0 flex space-x-3">
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
                    </div>

                    {booking.rating && (
                      <div className="mt-4 flex items-center">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= booking.rating!
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          You rated this service
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
