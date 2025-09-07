"use client";

import { useEffect, useState } from "react";
import ProviderHeader from "../../../components/ProviderHeader";
import {
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiStar,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiPlayCircle,
  FiInfo,
  FiArrowRight,
  FiGrid,
  FiMapPin,
  FiHome,
  FiTool,
  FiChevronDown,

} from "react-icons/fi";
import { motion } from "framer-motion";

interface Booking {
  id: string;
  service: string;
  customer: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
  date: string;
  time: string;
  address: string;
  price: number;
  duration: string;
  customerPhone: string;
  specialInstructions?: string;
}

interface Earnings {
  week: number;
  month: number;
  total: number;
  pending: number;
}

interface Review {
  rating: number;
  count: number;
}

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [earnings, setEarnings] = useState<Earnings>({
    week: 0,
    month: 0,
    total: 0,
    pending: 0
  });
  const [reviews, setReviews] = useState<Review>({
    rating: 0,
    count: 0
  });
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "schedule">("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API calls with mock data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Mock bookings data
        const mockBookings: Booking[] = [
          {
            id: "1",
            service: "Electrical Wiring Installation",
            customer: "Sarah Johnson",
            status: "in-progress",
            date: "2023-10-20",
            time: "10:00 AM",
            address: "123 Main St, Apt 4B",
            price: 250,
            duration: "3 hours",
            customerPhone: "+1 (555) 123-4567",
            specialInstructions: "Parking available in the back"
          },
          {
            id: "2",
            service: "Kitchen Sink Repair",
            customer: "Michael Chen",
            status: "confirmed",
            date: "2023-10-21",
            time: "2:30 PM",
            address: "456 Oak Avenue",
            price: 120,
            duration: "2 hours",
            customerPhone: "+1 (555) 987-6543"
          },
          {
            id: "3",
            service: "TV Mounting",
            customer: "Emma Williams",
            status: "pending",
            date: "2023-10-22",
            time: "11:00 AM",
            address: "789 Pine Road",
            price: 85,
            duration: "1.5 hours",
            customerPhone: "+1 (555) 456-7890"
          },
          {
            id: "4",
            service: "Bathroom Plumbing",
            customer: "David Rodriguez",
            status: "completed",
            date: "2023-10-18",
            time: "9:00 AM",
            address: "321 Cedar Lane",
            price: 180,
            duration: "2.5 hours",
            customerPhone: "+1 (555) 234-5678"
          },
          {
            id: "5",
            service: "Light Fixture Installation",
            customer: "Lisa Thompson",
            status: "cancelled",
            date: "2023-10-19",
            time: "3:00 PM",
            address: "654 Elm Street",
            price: 95,
            duration: "1 hour",
            customerPhone: "+1 (555) 345-6789"
          }
        ];

        // Mock earnings data
        const mockEarnings: Earnings = {
          week: 1250,
          month: 3850,
          total: 18700,
          pending: 650
        };

        // Mock reviews data
        const mockReviews: Review = {
          rating: 4.8,
          count: 47
        };

        setBookings(mockBookings);
        setEarnings(mockEarnings);
        setReviews(mockReviews);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings(bookings.map(booking => 
      booking.id === id ? { ...booking, status } : booking
    ));
  };

  const statusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-green-100 text-green-700";
      case "confirmed": return "bg-blue-100 text-blue-700";
      case "in-progress": return "bg-yellow-100 text-yellow-700";
      case "pending": return "bg-gray-100 text-gray-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const statusIcon = (status: string) => {
    switch(status) {
      case "completed": return <FiCheckCircle className="text-green-600" />;
      case "confirmed": return <FiCheckCircle className="text-blue-600" />;
      case "in-progress": return <FiPlayCircle className="text-yellow-600" />;
      case "pending": return <FiClock className="text-gray-600" />;
      case "cancelled": return <FiXCircle className="text-red-600" />;
      default: return <FiInfo className="text-gray-600" />;
    }
  };

  const statusActions = (status: string) => {
    switch(status) {
      case "pending": return ["confirm", "reject"];
      case "confirmed": return ["start", "reschedule"];
      case "in-progress": return ["complete", "issue"];
      default: return [];
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(item => (
              <div key={item} className="bg-gray-200 rounded-xl p-6 h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-xl p-6 h-64"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <ProviderHeader />

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("bookings")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "bookings"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Bookings
            </button>
            <button
              onClick={() => setActiveTab("schedule")}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "schedule"
                  ? "border-green-500 text-green-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Schedule
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
{/* Stats Cards */}
<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center text-center"
  >
    <div className="p-2 rounded-full bg-blue-100 text-blue-600 mb-2">
      <FiCalendar className="h-5 w-5" />
    </div>
    <p className="text-xs text-gray-500">Total</p>
    <h2 className="text-lg font-bold text-gray-900">{bookings.length}</h2>
  </motion.div>

  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center text-center"
  >
    <div className="p-2 rounded-full bg-green-100 text-green-600 mb-2">
      <FiDollarSign className="h-5 w-5" />
    </div>
    <p className="text-xs text-gray-500">Earnings</p>
    <h2 className="text-lg font-bold text-gray-900">{formatCurrency(earnings.month)}</h2>
  </motion.div>

  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
    className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center text-center"
  >
    <div className="p-2 rounded-full bg-yellow-100 text-yellow-600 mb-2">
      <FiStar className="h-5 w-5" />
    </div>
    <p className="text-xs text-gray-500">Rating</p>
    <div className="flex items-center justify-center">
      {renderStars(reviews.rating)}
      <span className="ml-1 text-[10px] text-gray-500">({reviews.count})</span>
    </div>
  </motion.div>

  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.3 }}
    className="bg-white border rounded-lg shadow-sm p-3 flex flex-col items-center text-center"
  >
    <div className="p-2 rounded-full bg-purple-100 text-purple-600 mb-2">
      <FiClock className="h-5 w-5" />
    </div>
    <p className="text-xs text-gray-500">Pending</p>
    <h2 className="text-lg font-bold text-gray-900">
      {bookings.filter(b => b.status === "pending").length}
    </h2>
  </motion.div>
</div>







            {/* Upcoming Bookings */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upcoming Bookings</h2>
                <p className="mt-1 text-sm text-gray-500">Your scheduled appointments for the next few days</p>
              </div>
              <div className="p-6">
                {bookings.filter(b => b.status === "confirmed" || b.status === "in-progress").length === 0 ? (
                  <p className="text-center text-gray-500 py-4">No upcoming bookings</p>
                ) : (
                  <div className="space-y-4">
                    {bookings
                      .filter(b => b.status === "confirmed" || b.status === "in-progress")
                      .slice(0, 3)
                      .map(booking => (
                        <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">{booking.service}</h3>
                            <p className="text-xs text-gray-500">{booking.customer} • {formatDate(booking.date)} at {booking.time}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                            {booking.status.replace("-", " ")}
                          </span>
                        </div>
                      ))
                    }
                  </div>
                )}
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setActiveTab("bookings")}
                    className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center mx-auto"
                  >
                    View all bookings <FiArrowRight className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Earnings Summary */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Earnings Summary</h2>
                <p className="mt-1 text-sm text-gray-500">Your earnings overview</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-gradient-to-b from-green-50 to-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.week)}</p>
                  <p className="text-sm text-gray-500">This Week</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-blue-50 to-purple-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.month)}</p>
                  <p className="text-sm text-gray-500">This Month</p>
                </div>
                <div className="text-center p-4 bg-gradient-to-b from-purple-50 to-pink-50 rounded-xl">
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(earnings.total)}</p>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Bookings Tab */}
{activeTab === "bookings" && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-sm border border-gray-100"
  >
    <div className="p-6 border-b border-gray-200">
      <h2 className="text-lg font-medium text-gray-900">All Bookings</h2>
      <p className="mt-1 text-sm text-gray-500">Tap a booking to view details & actions</p>
    </div>

    <div className="divide-y divide-gray-200">
      {bookings.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No bookings found</p>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="p-4">
            {/* Accordion Header */}
            <button
              onClick={() =>
                setExpandedId(expandedId === booking.id ? null : booking.id)
              }
              className="w-full flex justify-between items-center text-left"
            >
              <div>
                <h3 className="text-sm font-medium text-gray-900">{booking.service}</h3>
                <p className="text-xs text-gray-500">{booking.customer}</p>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                    booking.status
                  )}`}
                >
                  {statusIcon(booking.status)}
                  <span className="ml-1">{booking.status}</span>
                </span>
                <motion.span
                  initial={false}
                  animate={{ rotate: expandedId === booking.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3 text-gray-400"
                >
                  ▼
                </motion.span>
              </div>
            </button>

            {/* Accordion Body */}
            {expandedId === booking.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 space-y-2 text-sm text-gray-600"
              >
                <p>Date: {formatDate(booking.date)}</p>
                <p>Time: {booking.time}</p>
                <p>Price: {formatCurrency(booking.price)}</p>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {statusActions(booking.status).map((action) => (
                    <button
                      key={action}
                      onClick={() => {
                        if (action === "confirm") updateBookingStatus(booking.id, "confirmed");
                        if (action === "start") updateBookingStatus(booking.id, "in-progress");
                        if (action === "complete") updateBookingStatus(booking.id, "completed");
                        if (action === "reject") updateBookingStatus(booking.id, "cancelled");
                      }}
                      className={`text-xs px-3 py-1.5 rounded-md ${
                        action === "confirm" || action === "start" || action === "complete"
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {action}
                    </button>
                  ))}
                  <button className="text-green-600 hover:text-green-800 text-xs px-3 py-1.5 bg-green-50 rounded-md">
                    Details
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        ))
      )}
    </div>
  </motion.div>
)}


{activeTab === "schedule" && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-xl shadow-lg border border-gray-100 p-6"
  >
    {/* Header */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold text-gray-900">Weekly Timeline</h2>
      <p className="text-sm text-gray-500">Your appointments for the week</p>
    </div>

    {/* Vertical timeline */}
    <div className="space-y-8 relative">
      {Array.from({ length: 7 }).map((_, dayIndex) => {
        const date = new Date(2023, 9, 16 + dayIndex);
        const dayBookings = bookings.filter(
          b => new Date(b.date).getDate() === date.getDate()
        );

        return (
          <div key={dayIndex} className="flex items-start gap-6">
            {/* Date label */}
            <div className="w-24 text-right text-sm font-medium text-gray-500 flex flex-col items-end">
              <span>{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
              <span className="text-xs mt-1">{date.getDate()}</span>
            </div>

            {/* Timeline line */}
            <div className="relative flex-1">
              {/* Vertical connecting line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

              {/* Bookings */}
              <div className="space-y-6 pl-10">
                {dayBookings.length > 0 ? (
                  dayBookings.map((booking, idx) => (
                    <div key={booking.id} className="relative flex items-start gap-4 group">
                      {/* Timeline dot */}
                      <span className="absolute -left-10 top-3 w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></span>

                      {/* Booking card */}
                      <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 w-full">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-xs font-semibold text-blue-800 flex items-center gap-1">
                            <FiClock className="h-3 w-3" /> {booking.time}
                          </div>
                          <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(booking.status)}`}>
                            {booking.status.replace("-", " ")}
                          </div>
                        </div>

                        <div className="text-sm text-blue-900 font-medium">{booking.service}</div>
                        <div className="text-xs text-gray-500 mt-1">{booking.customer}</div>

                        <div className="text-xs text-gray-600 mt-2 space-y-1">
                          <div><strong>Location:</strong> {booking.location || "N/A"}</div>
                          <div><strong>Price:</strong> {formatCurrency(booking.price)}</div>
                          <div><strong>Tracking:</strong> {booking.trackingStatus || "Pending"}</div>
                        </div>

                        {/* Status progress indicator */}
                        <div className="mt-3 h-1 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full ${booking.status === "completed" ? "bg-green-500" : booking.status === "in-progress" ? "bg-yellow-400" : "bg-blue-400"}`}
                            style={{ width: "100%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-gray-400 italic pl-6">No bookings</div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </motion.div>
)}





      </div>
    </div>
  );
}