"use client";

import { useState, useEffect } from "react";

interface Booking {
  id: string;
  client: string;
  clientEmail: string;
  provider: string;
  providerEmail: string;
  service: string;
  status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled" | "rejected";
  date: string;
  time: string;
  duration: string;
  price: number;
  address: string;
  specialInstructions?: string;
  createdAt: string;
  rating?: number;
  review?: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<string>("");

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true);
      try {
        // Mock data
        const mockBookings: Booking[] = [
          {
            id: "BK001",
            client: "Sarah Johnson",
            clientEmail: "sarah.j@example.com",
            provider: "Mike's Plumbing",
            providerEmail: "mike@mikesplumbing.com",
            service: "Emergency Plumbing Repair",
            status: "completed",
            date: "2025-08-28",
            time: "10:00 AM",
            duration: "2 hours",
            price: 120,
            address: "123 Main St, Apt 4B, New York, NY",
            specialInstructions: "Use back entrance",
            createdAt: "2025-08-27",
            rating: 5,
            review: "Excellent service! Fixed the issue quickly."
          },
          {
            id: "BK002",
            client: "David Wilson",
            clientEmail: "david.w@example.com",
            provider: "John's Electrical",
            providerEmail: "john@johnselectrical.com",
            service: "Light Fixture Installation",
            status: "in-progress",
            date: "2025-08-31",
            time: "2:30 PM",
            duration: "1.5 hours",
            price: 85,
            address: "456 Oak Avenue, Brooklyn, NY",
            createdAt: "2025-08-29"
          },
          {
            id: "BK003",
            client: "Emma Thompson",
            clientEmail: "emma.t@example.com",
            provider: "Cool Air Experts",
            providerEmail: "service@coolairexperts.com",
            service: "AC Maintenance",
            status: "confirmed",
            date: "2025-09-02",
            time: "11:00 AM",
            duration: "3 hours",
            price: 150,
            address: "789 Pine Road, Queens, NY",
            createdAt: "2025-08-30"
          },
          {
            id: "BK004",
            client: "Michael Chen",
            clientEmail: "michael.c@example.com",
            provider: "Handyman Services",
            providerEmail: "info@handymanservices.com",
            service: "Furniture Assembly",
            status: "pending",
            date: "2025-09-03",
            time: "9:00 AM",
            duration: "2 hours",
            price: 75,
            address: "321 Cedar Lane, Bronx, NY",
            specialInstructions: "IKEA furniture assembly",
            createdAt: "2025-08-31"
          },
          {
            id: "BK005",
            client: "Lisa Rodriguez",
            clientEmail: "lisa.r@example.com",
            provider: "CleanPro",
            providerEmail: "booking@cleanpro.com",
            service: "Deep Cleaning",
            status: "cancelled",
            date: "2025-08-29",
            time: "1:00 PM",
            duration: "4 hours",
            price: 200,
            address: "654 Elm Street, Staten Island, NY",
            createdAt: "2025-08-25"
          },
          {
            id: "BK006",
            client: "Robert Brown",
            clientEmail: "robert.b@example.com",
            provider: "Install Experts",
            providerEmail: "contact@installexperts.com",
            service: "TV Mounting",
            status: "rejected",
            date: "2025-09-01",
            time: "3:00 PM",
            duration: "1 hour",
            price: 65,
            address: "987 Maple Drive, Jersey City, NJ",
            createdAt: "2025-08-28"
          }
        ];
        setBookings(mockBookings);
        setFilteredBookings(mockBookings);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(booking => booking.status === statusFilter);
    }
    
    // Apply service filter
    if (serviceFilter !== "all") {
      result = result.filter(booking => booking.service.toLowerCase().includes(serviceFilter.toLowerCase()));
    }
    
    // Apply date filter
    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date();
      
      switch(dateFilter) {
        case "today":
          result = result.filter(booking => booking.date === today.toISOString().split('T')[0]);
          break;
        case "tomorrow":
          filterDate.setDate(today.getDate() + 1);
          result = result.filter(booking => booking.date === filterDate.toISOString().split('T')[0]);
          break;
        case "week":
          filterDate.setDate(today.getDate() + 7);
          result = result.filter(booking => new Date(booking.date) <= filterDate);
          break;
        case "past":
          result = result.filter(booking => new Date(booking.date) < today);
          break;
      }
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(booking => 
        booking.client.toLowerCase().includes(term) ||
        booking.provider.toLowerCase().includes(term) ||
        booking.service.toLowerCase().includes(term) ||
        booking.id.toLowerCase().includes(term)
      );
    }
    
    setFilteredBookings(result);
  }, [bookings, statusFilter, serviceFilter, dateFilter, searchTerm]);

  const handleStatusChange = (bookingId: string, newStatus: Booking["status"]) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    setShowActionModal(false);
  };

  const handleActionClick = (booking: Booking, action: string) => {
    setSelectedBooking(booking);
    setActionType(action);
    setShowActionModal(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "completed": return "bg-emerald-100 text-emerald-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "in-progress": return "bg-amber-100 text-amber-800";
      case "pending": return "bg-gray-100 text-gray-800";
      case "cancelled": return "bg-rose-100 text-rose-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getServiceTypes = () => {
    const services = [...new Set(bookings.map(booking => booking.service))];
    return services;
  };

  const getStatusCount = (status: string) => {
    return bookings.filter(booking => booking.status === status).length;
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'text-amber-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="h-12 bg-gray-200 rounded mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(item => (
                  <div key={item} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(item => (
                  <div key={item} className="h-20 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Manage and monitor all service bookings</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{bookings.length}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-amber-600">{getStatusCount("pending")}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-emerald-600">{getStatusCount("completed")}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-rose-600">{getStatusCount("cancelled") + getStatusCount("rejected")}</div>
            <div className="text-sm text-gray-600">Cancelled/Rejected</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Bookings
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by client, provider, service, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="service-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                id="service-filter"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Services</option>
                {getServiceTypes().map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <select
                id="date-filter"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">Next 7 Days</option>
                <option value="past">Past Bookings</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Export Report
            </button>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">All Bookings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client & Provider
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Try adjusting your search or filter criteria
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.id}</div>
                        <div className="text-sm text-gray-500">
                          {formatDate(booking.date)} at {booking.time}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.client}</div>
                        <div className="text-sm text-gray-500">{booking.clientEmail}</div>
                        <div className="mt-2 text-sm font-medium text-gray-900">{booking.provider}</div>
                        <div className="text-sm text-gray-500">{booking.providerEmail}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{booking.service}</div>
                        <div className="text-sm text-gray-500">{booking.duration} • {formatCurrency(booking.price)}</div>
                        <div className="text-sm text-gray-500">{booking.address}</div>
                        {booking.rating && (
                          <div className="mt-2">
                            {renderStars(booking.rating)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace("-", " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => {
                              setSelectedBooking(booking);
                              setShowDetailModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 text-sm font-medium text-left"
                          >
                            View Details
                          </button>
                          {booking.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleActionClick(booking, "confirm")}
                                className="text-green-600 hover:text-green-900 text-sm font-medium text-left"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleActionClick(booking, "reject")}
                                className="text-red-600 hover:text-red-900 text-sm font-medium text-left"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {booking.status === "confirmed" && (
                            <button
                              onClick={() => handleActionClick(booking, "start")}
                              className="text-amber-600 hover:text-amber-900 text-sm font-medium text-left"
                            >
                              Start Service
                            </button>
                          )}
                          {booking.status === "in-progress" && (
                            <button
                              onClick={() => handleActionClick(booking, "complete")}
                              className="text-emerald-600 hover:text-emerald-900 text-sm font-medium text-left"
                            >
                              Complete
                            </button>
                          )}
                          {(booking.status === "pending" || booking.status === "confirmed") && (
                            <button
                              onClick={() => handleActionClick(booking, "cancel")}
                              className="text-rose-600 hover:text-rose-900 text-sm font-medium text-left"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {showDetailModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Booking Details - {selectedBooking.id}</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Client Information</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Name</dt>
                      <dd className="text-sm font-medium">{selectedBooking.client}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-sm">{selectedBooking.clientEmail}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Provider Information</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Service Provider</dt>
                      <dd className="text-sm font-medium">{selectedBooking.provider}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Email</dt>
                      <dd className="text-sm">{selectedBooking.providerEmail}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Service Details</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Service</dt>
                      <dd className="text-sm font-medium">{selectedBooking.service}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Date & Time</dt>
                      <dd className="text-sm">{formatDate(selectedBooking.date)} at {selectedBooking.time}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Duration</dt>
                      <dd className="text-sm">{selectedBooking.duration}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Price</dt>
                      <dd className="text-sm font-medium">{formatCurrency(selectedBooking.price)}</dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Location & Status</h4>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm text-gray-500">Address</dt>
                      <dd className="text-sm">{selectedBooking.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Status</dt>
                      <dd className="text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                          {selectedBooking.status.replace("-", " ")}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Created On</dt>
                      <dd className="text-sm">{formatDate(selectedBooking.createdAt)}</dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              {selectedBooking.specialInstructions && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Special Instructions</h4>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedBooking.specialInstructions}</p>
                </div>
              )}
              
              {selectedBooking.review && (
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-2">Customer Review</h4>
                  <div className="bg-emerald-50 p-3 rounded-lg">
                    {selectedBooking.rating && renderStars(selectedBooking.rating)}
                    <p className="text-sm text-gray-700 mt-2">{selectedBooking.review}</p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Confirmation Modal */}
        {showActionModal && selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {actionType === "confirm" && "Confirm Booking"}
                {actionType === "reject" && "Reject Booking"}
                {actionType === "start" && "Start Service"}
                {actionType === "complete" && "Complete Service"}
                {actionType === "cancel" && "Cancel Booking"}
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to {actionType} booking {selectedBooking.id}?
                {actionType === "reject" || actionType === "cancel" ? " This action cannot be undone." : ""}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowActionModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    let newStatus: Booking["status"] = selectedBooking.status;
                    if (actionType === "confirm") newStatus = "confirmed";
                    if (actionType === "reject") newStatus = "rejected";
                    if (actionType === "start") newStatus = "in-progress";
                    if (actionType === "complete") newStatus = "completed";
                    if (actionType === "cancel") newStatus = "cancelled";
                    
                    handleStatusChange(selectedBooking.id, newStatus);
                  }}
                  className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${
                    actionType === "reject" || actionType === "cancel" 
                      ? "bg-rose-600 hover:bg-rose-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}