"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ClientHeader from "../../../../../components/ClientHeader";
import MapView from "../../../../../components/MapView";
import PaymentButton from "../../../../../components/PaymentButton";
import { bookingsAPI } from "../../../../../lib/api";

interface BookingDetails {
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
    description: string;
  };
  provider: {
    id: string;
    name: string;
    rating: number;
    address: string;
    latitude?: number;
    longitude?: number;
    user: {
      email: string;
      phone: string;
    };
  };
  payment?: {
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  };
}

export default function BookingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [paymentStatus, setPaymentStatus] = useState<string>("");

  useEffect(() => {
    const fetchBookingDetails = async () => {
      if (!params.id) return;

      setIsLoading(true);
      try {
        const response = await bookingsAPI.getBooking(params.id as string);
        setBooking(response.data);
      } catch (error) {
        console.error("Failed to fetch booking details:", error);
        setError("Failed to load booking details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
  }, [params.id]);

  const getStatusColor = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentStatus("success");
    // Refresh booking data to show updated status
    if (params.id) {
      bookingsAPI
        .getBooking(params.id as string)
        .then((response) => setBooking(response.data))
        .catch(console.error);
    }
  };

  const handlePaymentFailure = (error: any) => {
    setPaymentStatus("failed");
    console.error("Payment failed:", error);
  };

  // Check if booking needs payment
  const needsPayment = booking && booking.status === "PENDING_PAYMENT";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ClientHeader />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Error</h1>
            <p className="mt-2 text-gray-600">{error || "Booking not found"}</p>
            <Link
              href="/dashboard/client/bookings"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/client/bookings"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 mb-4"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Bookings
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="mt-1 text-sm text-gray-600">Booking ID: {booking.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Information */}
          <div className="space-y-6">
            {/* Service Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Service Details
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Service</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.service.title}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Category
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.service.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    ${booking.service.price}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Duration
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.service.duration}
                  </dd>
                </div>
                {booking.service.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Description
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {booking.service.description}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Provider Details */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Provider Details
              </h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Business Name
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.provider.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-4 w-4 ${
                              star <= booking.provider.rating
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
                      <span className="ml-2 text-sm text-gray-600">
                        {booking.provider.rating}/5
                      </span>
                    </div>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.provider.user.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.provider.user.phone}
                  </dd>
                </div>
                {booking.provider.address && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">
                      Provider Address
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {booking.provider.address}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Booking Status & Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Booking Status
              </h2>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status.replace("_", " ")}
                </span>
                {booking.date && (
                  <span className="text-sm text-gray-600">
                    Scheduled: {formatDate(booking.date)}
                  </span>
                )}
              </div>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Created At
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(booking.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Last Updated
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDate(booking.updatedAt)}
                  </dd>
                </div>
                {booking.notes && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Notes</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {booking.notes}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Payment Details */}
            {booking.payment && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Payment Details
                </h2>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Amount
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      ${booking.payment.amount}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Status
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          booking.payment.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : booking.payment.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.payment.status}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Payment Date
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {formatDate(booking.payment.createdAt)}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </div>

          {/* Location & Map */}
          <div className="space-y-6">
            {/* Client Address */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Service Location
              </h2>
              <div className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Client Address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {booking.clientAddress}
                  </dd>
                </div>
                {booking.clientLatitude && booking.clientLongitude && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Coordinates
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {booking.clientLatitude.toFixed(6)},{" "}
                      {booking.clientLongitude.toFixed(6)}
                    </dd>
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {booking.clientLatitude && booking.clientLongitude && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Location Map
                </h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapView
                    latitude={booking.clientLatitude}
                    longitude={booking.clientLongitude}
                    zoom={15}
                    height="256px"
                    markers={[
                      {
                        lat: booking.clientLatitude,
                        lon: booking.clientLongitude,
                        label: "Service Location",
                        color: "blue",
                      },
                      ...(booking.provider.latitude &&
                      booking.provider.longitude
                        ? [
                            {
                              lat: booking.provider.latitude,
                              lon: booking.provider.longitude,
                              label: booking.provider.name,
                              color: "red",
                            },
                          ]
                        : []),
                    ]}
                  />
                </div>
                <div className="mt-4 flex space-x-3">
                  <a
                    href={`https://www.google.com/maps?q=${booking.clientLatitude},${booking.clientLongitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
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
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Actions
              </h2>
              <div className="space-y-3">
                {/* Payment Section */}
                {needsPayment && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-yellow-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                          Payment Required
                        </h3>
                        <p className="text-sm text-yellow-700 mt-1">
                          Complete payment to confirm your booking with{" "}
                          {booking.provider.name}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <PaymentButton
                        bookingId={booking.id}
                        amount={booking.service.price}
                        providerId={booking.provider.id}
                        serviceName={booking.service.title}
                        providerName={booking.provider.name}
                        onSuccess={handlePaymentSuccess}
                        onFailure={handlePaymentFailure}
                      />
                    </div>
                  </div>
                )}

                {/* Payment Success Message */}
                {paymentStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-green-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-green-800">
                          Payment Successful!
                        </h3>
                        <p className="text-sm text-green-700 mt-1">
                          Your booking has been confirmed. The provider will
                          contact you soon.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment Failed Message */}
                {paymentStatus === "failed" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <svg
                        className="w-5 h-5 text-red-400 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h3 className="text-sm font-medium text-red-800">
                          Payment Failed
                        </h3>
                        <p className="text-sm text-red-700 mt-1">
                          There was an issue processing your payment. Please try
                          again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.status === "COMPLETED" && (
                  <Link
                    href={`/dashboard/client/bookings/${booking.id}/review`}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Review
                  </Link>
                )}

                {(booking.status === "PENDING_PAYMENT" ||
                  booking.status === "PENDING") && (
                  <button
                    onClick={() => {
                      // Add cancel booking functionality here
                      console.log("Cancel booking");
                    }}
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
                  >
                    Cancel Booking
                  </button>
                )}
                <Link
                  href={`tel:${booking.provider.user.phone}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Call Provider
                </Link>
                <Link
                  href={`mailto:${booking.provider.user.email}`}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Email Provider
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
