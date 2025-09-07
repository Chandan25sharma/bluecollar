"use client";
import { useEffect, useState } from "react";
import ProviderHeader from "../../../../components/ProviderHeader";
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiCheckCircle,
  FiXCircle,
  FiPlayCircle,
  FiInfo,
  FiMapPin,
  FiChevronDown,
  FiUser,
  FiChevronUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Booking {
  id: string;
  clientName: string;
  clientImage: string;
  service: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  date: string;
  time: string;
  duration: string;
  price: number;
  address: string;
  contact: string;
  specialInstructions?: string;
  rating?: number;
}

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-desc");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate API call with mock data
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockBookings: Booking[] = [
          {
            id: "1",
            clientName: "Sarah Johnson",
            clientImage: "",
            service: "Electrical Wiring Installation",
            status: "in-progress",
            date: "2023-10-20",
            time: "10:00 AM",
            duration: "3 hours",
            price: 250,
            address: "123 Main St, Apt 4B, New York, NY",
            contact: "+1 (555) 123-4567",
            specialInstructions: "Parking available in the back",
          },
          {
            id: "2",
            clientName: "Michael Chen",
            clientImage: "",
            service: "Kitchen Sink Repair",
            status: "confirmed",
            date: "2023-10-21",
            time: "2:30 PM",
            duration: "2 hours",
            price: 120,
            address: "456 Oak Avenue, Brooklyn, NY",
            contact: "+1 (555) 987-6543",
          },
          {
            id: "3",
            clientName: "Emma Williams",
            clientImage: "",
            service: "TV Mounting",
            status: "pending",
            date: "2023-10-22",
            time: "11:00 AM",
            duration: "1.5 hours",
            price: 85,
            address: "789 Pine Road, Queens, NY",
            contact: "+1 (555) 456-7890",
          },
          {
            id: "4",
            clientName: "David Rodriguez",
            clientImage: "",
            service: "Bathroom Plumbing",
            status: "completed",
            date: "2023-10-18",
            time: "9:00 AM",
            duration: "2.5 hours",
            price: 180,
            address: "321 Cedar Lane, Bronx, NY",
            contact: "+1 (555) 234-5678",
            rating: 5,
          },
          {
            id: "5",
            clientName: "Lisa Thompson",
            clientImage: "",
            service: "Light Fixture Installation",
            status: "cancelled",
            date: "2023-10-19",
            time: "3:00 PM",
            duration: "1 hour",
            price: 95,
            address: "654 Elm Street, Staten Island, NY",
            contact: "+1 (555) 345-6789",
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

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings(
      bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "confirmed":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      case "pending":
        return "bg-gray-100 text-gray-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="h-4 w-4" />;
      case "confirmed":
        return <FiCheckCircle className="h-4 w-4" />;
      case "in-progress":
        return <FiPlayCircle className="h-4 w-4" />;
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "cancelled":
        return <FiXCircle className="h-4 w-4" />;
      default:
        return <FiInfo className="h-4 w-4" />;
    }
  };

  const statusActions = (status: string) => {
    switch (status) {
      case "pending":
        return ["confirm", "reject"];
      case "confirmed":
        return ["start", "reschedule"];
      case "in-progress":
        return ["complete", "issue"];
      default:
        return [];
    }
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      (filter === "all" || booking.status === filter) &&
      (searchQuery === "" ||
        booking.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.service.toLowerCase().includes(searchQuery.toLowerCase()))
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
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusCount = (status: string) => {
    return bookings.filter((booking) => booking.status === status).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
        <div className="max-w-8xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-xl p-4 h-32 shadow-sm"
                ></div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-6 h-96 shadow-sm"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-8xl mx-auto px-0 sm:px-0 lg:px-0 py-0">
        {/* Header */}
        <ProviderHeader />

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-0 text-[12px]">
            Manage your service appointments and client bookings
          </p>
        </div>
        {/* Filters and Controls */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-2 py-0.5 border border-gray-300 rounded-xl focus:outline-none  text-sm"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-100 border border-gray-300 text-gray-500 py-1 px-2 pr-6 rounded-xl leading-tight text-sm"
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="price-asc">Price: Low to High</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bookings List with Accordion */}
          <div className="p-2">
            {sortedBookings.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                  <FiCalendar className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No bookings found
                </h3>
                <p className="mt-2 text-gray-500">
                  {filter === "all" && searchQuery === ""
                    ? "You don't have any bookings yet."
                    : `No ${
                        filter !== "all" ? filter + " " : ""
                      }bookings match your search.`}
                </p>
                {(filter !== "all" || searchQuery !== "") && (
                  <button
                    onClick={() => {
                      setFilter("all");
                      setSearchQuery("");
                    }}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedBookings.map((booking) => (
                  <div key={booking.id} className="py-4">
                    {/* Accordion Header */}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === booking.id ? null : booking.id
                        )
                      }
                      className="w-full flex justify-between items-center text-left"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br rounded-full flex items-center justify-center text-white font-semibold mr-3">
                          {booking.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {booking.service}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {booking.clientName}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-1 py-0 rounded-xl text-xs font-medium ${statusColor(
                            booking.status
                          )}`}
                        >
                          {statusIcon(booking.status)}
                          <span className="ml-1 capitalize">
                            {booking.status.replace("-", " ")}
                          </span>
                        </span>
                        <motion.span
                          initial={false}
                          animate={{
                            rotate: expandedId === booking.id ? 180 : 0,
                          }}
                          transition={{ duration: 0.2 }}
                          className="ml-3 text-gray-400"
                        >
                          <FiChevronDown className="h-4 w-4" />
                        </motion.span>
                      </div>
                    </button>

                    {/* Accordion Body */}
                    <AnimatePresence>
                      {expandedId === booking.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 space-y-3 text-sm text-gray-600"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Date & Time
                              </p>
                              <p className="text-gray-900">
                                {formatDate(booking.date)} at {booking.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Duration
                              </p>
                              <p className="text-gray-900">
                                {booking.duration}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Price
                              </p>
                              <p className="text-lg font-semibold text-green-600">
                                {formatCurrency(booking.price)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Contact
                              </p>
                              <p className="text-gray-900">{booking.contact}</p>
                            </div>
                          </div>

                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Address
                            </p>
                            <div className="flex items-center mt-1">
                              <FiMapPin className="text-gray-400 mr-2 h-4 w-4" />
                              <p className="text-gray-900">{booking.address}</p>
                            </div>
                          </div>

                          {booking.specialInstructions && (
                            <div>
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                Special Instructions
                              </p>
                              <p className="text-gray-900">
                                {booking.specialInstructions}
                              </p>
                            </div>
                          )}

                          {booking.rating && (
                            <div className="flex items-center">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`h-4 w-4 ${
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
                                Customer rating
                              </span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-3">
                            {statusActions(booking.status).map((action) => (
                              <button
                                key={action}
                                onClick={() => {
                                  if (action === "confirm")
                                    updateBookingStatus(
                                      booking.id,
                                      "confirmed"
                                    );
                                  if (action === "start")
                                    updateBookingStatus(
                                      booking.id,
                                      "in-progress"
                                    );
                                  if (action === "complete")
                                    updateBookingStatus(
                                      booking.id,
                                      "completed"
                                    );
                                  if (action === "reject")
                                    updateBookingStatus(
                                      booking.id,
                                      "cancelled"
                                    );
                                }}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                                  action === "confirm" ||
                                  action === "start" ||
                                  action === "complete"
                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                {action.charAt(0).toUpperCase() +
                                  action.slice(1)}
                              </button>
                            ))}
                            <button className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-lg font-medium hover:shadow-md transition-all text-sm">
                              View Details
                            </button>
                          </div>

                          {/* Booking ID */}
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              Booking ID: {booking.id}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
