"use client";

import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingsAPI, servicesAPI } from "../../../lib/api";
import { authUtils } from "../../../lib/auth";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
  provider?: {
    id: string;
    businessName: string;
  };
}

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const serviceId = params.serviceId as string;
  const providerId = searchParams.get("providerId");

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Form data
  const [bookingDate, setBookingDate] = useState("");
  const [notes, setNotes] = useState("");

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

    fetchService();
  }, [router, serviceId]);

  const fetchService = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      const foundService = response.data.find(
        (s: Service) => s.id === serviceId
      );

      if (foundService && foundService.isActive) {
        setService(foundService);
      } else {
        setError("Service not found or not available");
      }
    } catch (err: any) {
      console.error("Error fetching service:", err);
      setError(err.response?.data?.message || "Failed to load service");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await bookingsAPI.createBooking({
        serviceId: service!.id,
        date: bookingDate,
        notes: notes.trim() || undefined,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/client");
      }, 2000);
    } catch (err: any) {
      console.error("Error creating booking:", err);
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Service not found"}</p>
          <Link
            href="/dashboard/client"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Booking Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your booking request has been sent to the provider. You'll receive a
            notification once they confirm.
          </p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/dashboard/client"
            className="text-blue-600 hover:text-blue-700 flex items-center mb-4"
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
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Service</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Service Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Service Details
              </h2>
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {service.title}
                  </h3>
                  <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {service.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="pt-3 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {service.duration}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${service.price}
                    </span>
                  </div>
                  {service.provider && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Provider:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {service.provider.businessName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Booking Information
              </h2>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {/* Date Selection */}
                  <div>
                    <label
                      htmlFor="bookingDate"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Preferred Date & Time *
                    </label>
                    <input
                      type="datetime-local"
                      id="bookingDate"
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Provider will confirm the final visit time
                    </p>
                  </div>

                  {/* Notes */}
                  <div>
                    <label
                      htmlFor="notes"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="notes"
                      rows={4}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific requirements or details the provider should know..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Booking Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Service:</span>
                        <span className="font-medium text-gray-900">
                          {service.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium text-gray-900">
                          {service.duration}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-900 font-semibold">
                          Total Amount:
                        </span>
                        <span className="text-xl font-bold text-green-600">
                          ${service.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {submitting ? "Processing..." : "Confirm Booking"}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    By confirming, you agree to pay ${service.price} for this
                    service once completed. The provider will contact you to
                    confirm the final visit time.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
