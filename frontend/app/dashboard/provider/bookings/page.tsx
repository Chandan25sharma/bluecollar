"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDollarSign,
  FiMail,
  FiMapPin,
  FiNavigation,
  FiPhone,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";
import MapView from "../../../../components/MapView";
import ProviderHeader from "../../../../components/ProviderHeader";
import { bookingsAPI } from "../../../../lib/api";
import { openInGoogleMaps } from "../../../../lib/location";

interface Booking {
  id: string;
  status: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
  date: string;
  notes: string | null;
  totalAmount: number;
  distance?: number;
  clientAddress?: string;
  clientLatitude?: number;
  clientLongitude?: number;
  service: {
    id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    duration: string;
  };
  client: {
    id: string;
    name: string;
    user?: {
      email: string;
      phone: string;
    };
  };
}

export default function ProviderBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocationBooking, setSelectedLocationBooking] =
    useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await bookingsAPI.getProviderBookings();
      setBookings(response.data);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await bookingsAPI.updateBookingStatus(bookingId, newStatus);
      await fetchBookings(); // Refresh bookings
    } catch (err: any) {
      console.error("Error updating booking status:", err);
      setError(
        err.response?.data?.message || "Failed to update booking status"
      );
    }
  };

  // Location modal handlers
  const showLocationOnMap = (booking: Booking) => {
    setSelectedLocationBooking(booking);
    setShowLocationModal(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesFilter = filter === "all" || booking.status === filter;
    const matchesSearch =
      searchQuery === "" ||
      booking.client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "ACCEPTED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <>
        <ProviderHeader />
        <div className="p-6 pb-20 md:pb-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ProviderHeader />
      <div className="p-6 pb-20 md:pb-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-1">
              Manage your service bookings and requests
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FiClock className="text-yellow-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {bookings.filter((b) => b.status === "PENDING").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FiCalendar className="text-blue-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Accepted</p>
                <p className="text-2xl font-bold text-blue-600">
                  {bookings.filter((b) => b.status === "ACCEPTED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FiCheckCircle className="text-green-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {bookings.filter((b) => b.status === "COMPLETED").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FiDollarSign className="text-purple-600" size={20} />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-purple-600">
                  $
                  {bookings
                    .filter((b) => b.status === "COMPLETED")
                    .reduce((sum, b) => sum + b.totalAmount, 0)
                    .toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-3 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search by client name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              {["all", "PENDING", "ACCEPTED", "COMPLETED", "CANCELLED"].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      filter === status
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status === "all" ? "All" : status}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No bookings found
              </h3>
              <p className="text-gray-500">
                {filter === "all"
                  ? "You don't have any bookings yet."
                  : `No ${filter.toLowerCase()} bookings found.`}
              </p>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">
                            {booking.client.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {booking.service.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Client: {booking.client.name}
                        </p>
                        {booking.status === "PENDING" &&
                          booking.clientAddress && (
                            <div className="flex items-center text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1">
                              <FiMapPin className="mr-1" size={12} />
                              <span className="truncate">
                                {booking.clientAddress}
                              </span>
                              {booking.distance && (
                                <span className="ml-2 text-xs">
                                  ({booking.distance.toFixed(1)}km away)
                                </span>
                              )}
                            </div>
                          )}
                        <p className="text-sm text-gray-500">
                          {formatDate(booking.date)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ${booking.totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {booking.status === "PENDING" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "ACCEPTED")
                            }
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <FiCheckCircle className="mr-2" size={16} />
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(booking.id, "CANCELLED")
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <FiXCircle className="mr-2" size={16} />
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === "ACCEPTED" && (
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking.id, "COMPLETED")
                          }
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          <FiCheckCircle className="mr-2" size={16} />
                          Mark Complete
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === booking.id ? null : booking.id
                        )
                      }
                      className="text-green-600 hover:text-green-500 text-sm font-medium"
                    >
                      {expandedId === booking.id
                        ? "Less Details"
                        : "More Details"}
                    </button>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === booking.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Client Contact Info */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                              Client Contact
                            </h4>
                            <div className="space-y-2">
                              {booking.client.user?.email && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <FiMail className="mr-2" size={16} />
                                  <a
                                    href={`mailto:${booking.client.user.email}`}
                                    className="hover:text-green-600"
                                  >
                                    {booking.client.user.email}
                                  </a>
                                </div>
                              )}
                              {booking.client.user?.phone && (
                                <div className="flex items-center text-sm text-gray-600">
                                  <FiPhone className="mr-2" size={16} />
                                  <a
                                    href={`tel:${booking.client.user.phone}`}
                                    className="hover:text-green-600"
                                  >
                                    {booking.client.user.phone}
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Service Location */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">
                              Service Location
                            </h4>
                            {booking.clientAddress ? (
                              <div className="space-y-2">
                                <div className="flex items-start text-sm text-gray-600">
                                  <FiMapPin className="mr-2 mt-0.5" size={16} />
                                  <span>{booking.clientAddress}</span>
                                </div>
                                {booking.distance && (
                                  <p className="text-sm text-gray-500 ml-6">
                                    Distance: ~{booking.distance.toFixed(1)}{" "}
                                    miles
                                  </p>
                                )}
                                <div className="ml-6 flex gap-2">
                                  <button
                                    onClick={() =>
                                      openInGoogleMaps(booking.clientAddress!)
                                    }
                                    className="inline-flex items-center text-sm text-green-600 hover:text-green-500"
                                  >
                                    <FiNavigation className="mr-1" size={14} />
                                    Open in Maps
                                  </button>
                                  {booking.clientLatitude &&
                                    booking.clientLongitude && (
                                      <button
                                        onClick={() =>
                                          showLocationOnMap(booking)
                                        }
                                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                                      >
                                        <FiMapPin className="mr-1" size={14} />
                                        View on Map
                                      </button>
                                    )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500">
                                <p className="mb-2">
                                  Client location not available
                                </p>
                                <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                                  ⚠️ Note: Client location will help you
                                  determine travel time and accept suitable
                                  requests
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Service Details */}
                        <div className="mt-6">
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Service Details
                          </h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-2">
                              {booking.service.description}
                            </p>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span>Duration: {booking.service.duration}</span>
                              <span>Category: {booking.service.category}</span>
                            </div>
                            {booking.notes && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-sm font-medium text-gray-900">
                                  Client Notes:
                                </p>
                                <p className="text-sm text-gray-600 mt-1">
                                  {booking.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Location Map Modal */}
      <AnimatePresence>
        {showLocationModal &&
          selectedLocationBooking &&
          selectedLocationBooking.clientLatitude &&
          selectedLocationBooking.clientLongitude && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowLocationModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      Service Location
                    </h2>
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      Client: {selectedLocationBooking.client.name}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedLocationBooking.clientAddress}
                    </p>
                    {selectedLocationBooking.distance && (
                      <p className="text-sm text-green-600">
                        Distance: ~{selectedLocationBooking.distance.toFixed(1)}{" "}
                        km from you
                      </p>
                    )}
                  </div>

                  <MapView
                    latitude={selectedLocationBooking.clientLatitude}
                    longitude={selectedLocationBooking.clientLongitude}
                    zoom={15}
                    height="400px"
                    className="w-full"
                  />

                  <div className="mt-4 flex justify-end gap-3">
                    <button
                      onClick={() => setShowLocationModal(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Close
                    </button>
                    <button
                      onClick={() =>
                        openInGoogleMaps(selectedLocationBooking.clientAddress!)
                      }
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Open in Google Maps
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
      </AnimatePresence>
    </>
  );
}
