"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { bookingsAPI, paymentsAPI, profileAPI } from "../../lib/api";
import { authUtils } from "../../lib/auth";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  provider: {
    id: string;
    name: string;
    rate: number;
    verified: boolean;
    user: {
      email: string;
      phone: string;
    };
  };
}

interface BookingData {
  serviceId: string;
  providerId: string;
  date: string;
  notes?: string;
  clientAddress?: string;
  clientLatitude?: number;
  clientLongitude?: number;
}

interface CreateBookingWithPaymentProps {
  service: Service;
  onClose?: () => void;
  onSuccess?: (booking: any) => void;
  preSelectedBookingData?: {
    providerId: string;
    providerName: string;
    date: string;
    time: string;
    notes?: string;
    clientAddress?: string;
    clientLatitude?: number;
    clientLongitude?: number;
  };
}

export default function CreateBookingWithPayment({
  service,
  onClose,
  onSuccess,
  preSelectedBookingData,
}: CreateBookingWithPaymentProps) {
  // If we have pre-selected data, start at payment step, otherwise start at details
  const [step, setStep] = useState(preSelectedBookingData ? 2 : 1); // 1: Details, 2: Payment, 3: Success
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize booking data with pre-selected data if available
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: service.id,
    providerId: preSelectedBookingData?.providerId || service.provider.id,
    date: preSelectedBookingData
      ? (() => {
          // Convert date and time back to ISO string
          const convertTo24Hour = (time12h: string) => {
            const [time, modifier] = time12h.split(" ");
            let [hours, minutes] = time.split(":");
            if (hours === "12") {
              hours = "00";
            }
            if (modifier === "PM") {
              hours = (parseInt(hours, 10) + 12).toString();
            }
            return `${hours.padStart(2, "0")}:${minutes}`;
          };
          const time24h = convertTo24Hour(preSelectedBookingData.time);
          return new Date(
            `${preSelectedBookingData.date}T${time24h}:00`
          ).toISOString();
        })()
      : "",
    notes: preSelectedBookingData?.notes || "",
    clientAddress: preSelectedBookingData?.clientAddress || "",
    clientLatitude: preSelectedBookingData?.clientLatitude,
    clientLongitude: preSelectedBookingData?.clientLongitude,
  });

  const [paymentData, setPaymentData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
  });

  const [createdBooking, setCreatedBooking] = useState<any>(null);
  const [paymentOrder, setPaymentOrder] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Load user data for payment
    const fetchClientData = async () => {
      try {
        const user = authUtils.getUser();
        if (user) {
          // Get client profile for name
          const profileResponse = await profileAPI.getClientProfile();
          const clientProfile = profileResponse.data;

          setPaymentData((prev) => ({
            ...prev,
            customerName: clientProfile?.name || "",
            customerEmail: user.email || "",
            customerPhone: user.phone || "",
          }));
        }
      } catch (error) {
        console.error("Error fetching client data:", error);
        // Fallback to user data only
        const user = authUtils.getUser();
        if (user) {
          setPaymentData((prev) => ({
            ...prev,
            customerEmail: user.email || "",
            customerPhone: user.phone || "",
          }));
        }
      }
    };

    fetchClientData();
  }, []);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Get client ID from authenticated user
      const user = authUtils.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Create booking payload with clientId as string
      const bookingPayload = {
        ...bookingData,
        clientId: String(user.id), // Ensure clientId is string
        serviceId: String(bookingData.serviceId), // Ensure serviceId is string
        providerId: String(bookingData.providerId), // Ensure providerId is string
      };

      const bookingRes = await bookingsAPI.createBooking(bookingPayload);
      const booking = bookingRes.data;
      setCreatedBooking(booking);

      // Automatically complete payment simulation instead of going to payment step
      console.log("🚀 Auto-completing payment after booking creation...");

      // Create payment order
      const orderRes = await paymentsAPI.createOrder(
        String(booking.id),
        service.price,
        String(bookingData.providerId)
      );
      const order = orderRes.data;

      // Immediately simulate successful payment
      const verifyRes = await paymentsAPI.verifyPayment({
        razorpay_order_id: String(order.id),
        razorpay_payment_id: `pay_AUTO_${Date.now()}`,
        razorpay_signature: `sig_auto_${Date.now()}`,
      });

      const verification = verifyRes.data;
      console.log("✅ Auto-payment completed successfully!");

      // Go directly to success step
      setStep(3);
      onSuccess?.(verification.booking || booking);
    } catch (err: any) {
      setError(err.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      // Create payment order via API helper
      const paymentRes = await paymentsAPI.createOrder(
        String(createdBooking.id), // Ensure booking ID is string
        service.price,
        String(createdBooking.providerId || bookingData.providerId) // Ensure provider ID is string
      );
      const paymentOrder = paymentRes.data;
      setPaymentOrder(paymentOrder);

      // For testing - simulate payment completion
      if (process.env.NODE_ENV === "development") {
        // Show test payment options: instead of opening Razorpay for testing,
        // present a simple in-page choice. We'll simulate success on click.
        const useTestPayment = confirm(
          "Use test payment? Click OK to simulate a successful payment (no real payment)."
        );

        if (useTestPayment) {
          // Directly simulate the payment flow using the paymentsAPI verify endpoint
          await handleTestPayment(paymentOrder.id);
          return;
        }
      }

      // Initialize Razorpay payment with auto-detected client data
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        name: "BlueCollar Services",
        description: `Payment for ${service.title}`,
        order_id: paymentOrder.id,
        prefill: {
          name: paymentData.customerName,
          email: paymentData.customerEmail,
          contact: paymentData.customerPhone,
        },
        theme: {
          color: "#2563eb",
        },
        handler: async function (response: any) {
          await handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function () {
            setError("Payment was cancelled");
            setLoading(false);
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      setError(err.message || "Failed to process payment");
      setLoading(false);
    }
  };

  const handleTestPayment = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");
      // Simulate successful payment by calling paymentsAPI.verifyPayment with test ids
      const verificationRes = await paymentsAPI.verifyPayment({
        razorpay_order_id: orderId,
        razorpay_payment_id: `pay_TEST${Date.now()}`,
        razorpay_signature: "test_signature",
      });

      const verification = verificationRes.data;

      // Move to success step and call onSuccess with returned booking data (if any)
      setStep(3);
      onSuccess?.(verification.booking || createdBooking);
    } catch (err: any) {
      setError(err.message || "Payment verification failed");
      setLoading(false);
    }
  };

  // New helper: simulate payment when user clicks a payment method button in UI
  const simulatePaymentClick = async (method: string) => {
    setError("");
    setLoading(true);

    console.log(`🎯 Starting ${method} payment simulation...`);

    try {
      // Step 1: Ensure booking exists
      let booking = createdBooking;
      if (!booking) {
        console.log("📝 Creating booking...");

        // Get client ID from authenticated user
        const user = authUtils.getUser();
        if (!user) {
          throw new Error("User not authenticated");
        }

        // Create booking payload with clientId as string
        const bookingPayload = {
          ...bookingData,
          clientId: String(user.id), // Ensure clientId is string
          serviceId: String(bookingData.serviceId), // Ensure serviceId is string
          providerId: String(bookingData.providerId), // Ensure providerId is string
        };

        const bookingRes = await bookingsAPI.createBooking(bookingPayload);
        booking = bookingRes.data;
        setCreatedBooking(booking);
        console.log("✅ Booking created:", booking.id);
      }

      // Step 2: Create payment order
      console.log("💳 Creating payment order...");
      const orderRes = await paymentsAPI.createOrder(
        String(booking.id), // Ensure bookingId is string
        service.price,
        String(bookingData.providerId) // Ensure providerId is string
      );
      const order = orderRes.data;
      console.log("✅ Payment order created:", order.id);

      // Step 3: Immediately simulate successful payment
      console.log(`🚀 Simulating ${method} payment success...`);
      const verifyRes = await paymentsAPI.verifyPayment({
        razorpay_order_id: String(order.id), // Ensure order ID is string
        razorpay_payment_id: `pay_TEST_${method.toUpperCase()}_${Date.now()}`,
        razorpay_signature: `sig_test_${method}_${Date.now()}`,
      });

      const verification = verifyRes.data;
      console.log("✅ Payment verified successfully!");

      // Step 4: Complete booking flow
      setStep(3);
      onSuccess?.(verification.booking || booking);
    } catch (err: any) {
      console.error("❌ Payment simulation failed:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err.message ||
        `${method} payment failed`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      const token = localStorage.getItem("token");

      // Verify payment with backend
      const verifyResponse = await fetch(
        "http://localhost:4001/api/payments/verify",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          }),
        }
      );

      if (!verifyResponse.ok) {
        throw new Error("Payment verification failed");
      }

      const verification = await verifyResponse.json();

      // Move to success step
      setStep(3);
      onSuccess?.(verification.booking);
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Payment verification failed");
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(price);
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Your payment was successful and your booking has been confirmed.
              The provider will contact you soon.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Booking Details
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <strong>Service:</strong> {service.title}
                </p>
                <p>
                  <strong>Provider:</strong> {service.provider.name}
                </p>
                <p>
                  <strong>Date:</strong> {formatDateTime(bookingData.date)}
                </p>
                <p>
                  <strong>Amount:</strong> {formatPrice(service.price)}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                onClose?.();
                router.push("/dashboard/client");
              }}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 1
                ? "Book Service"
                : preSelectedBookingData
                ? "Confirm & Pay"
                : "Complete Payment"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {step === 1
                ? "Enter booking details"
                : preSelectedBookingData
                ? "Review your booking and complete payment"
                : "Secure payment processing"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
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

        {/* Progress Steps */}
        {!preSelectedBookingData && (
          <div className="px-6 py-4 bg-gray-50 border-b">
            <div className="flex items-center">
              <div
                className={`flex items-center ${
                  step >= 1 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </span>
                <span className="ml-2 text-sm font-medium">
                  Booking Details
                </span>
              </div>
              <div
                className={`flex-1 h-px mx-4 ${
                  step >= 2 ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>
              <div
                className={`flex items-center ${
                  step >= 2 ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= 2
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </span>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>
        )}

        {/* Progress for Pre-selected Booking */}
        {preSelectedBookingData && (
          <div className="px-6 py-4 bg-green-50 border-b">
            <div className="flex items-center justify-center">
              <div className="flex items-center text-green-700">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-600 text-white">
                  ✓
                </span>
                <span className="ml-2 text-sm font-medium">
                  Booking Details Complete
                </span>
              </div>
              <div className="flex-1 h-px mx-4 bg-green-600"></div>
              <div className="flex items-center text-green-700">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium bg-green-600 text-white">
                  💳
                </span>
                <span className="ml-2 text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          {/* Service Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-gray-900">{service.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-600">
                  <span className="font-medium">{service.provider.name}</span>
                  {service.provider.verified && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  {formatPrice(service.price)}
                </div>
                <div className="text-sm text-gray-500">{service.duration}</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Step 1: Booking Details */}
          {step === 1 && (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={bookingData.date}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Address
                </label>
                <input
                  type="text"
                  value={bookingData.clientAddress}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      clientAddress: e.target.value,
                    }))
                  }
                  placeholder="Enter the address where service is needed"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="Any special instructions or requirements..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !bookingData.date}
                  className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating..." : "Continue to Payment"}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Payment Details */}
          {step === 2 && (
            <div className="space-y-6">
              {/* Booking Summary - only show if we have pre-selected data */}
              {preSelectedBookingData && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-medium text-green-900 mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-green-700">Service:</span>
                      <span className="font-medium text-green-900">
                        {service.title}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Provider:</span>
                      <span className="font-medium text-green-900">
                        {preSelectedBookingData.providerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Date:</span>
                      <span className="font-medium text-green-900">
                        {new Date(
                          preSelectedBookingData.date
                        ).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Time:</span>
                      <span className="font-medium text-green-900">
                        {preSelectedBookingData.time}
                      </span>
                    </div>
                    {preSelectedBookingData.notes && (
                      <div className="flex justify-between">
                        <span className="text-green-700">Notes:</span>
                        <span className="font-medium text-green-900">
                          {preSelectedBookingData.notes}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  Payment Summary
                </h4>
                <div className="flex justify-between text-sm text-blue-800 mb-1">
                  <span>Service Cost:</span>
                  <span>{formatPrice(service.price)}</span>
                </div>
                <div className="flex justify-between text-sm text-blue-800 mb-1">
                  <span>Platform Fee:</span>
                  <span>{formatPrice(0)}</span>
                </div>
                <div className="border-t border-blue-200 pt-2 mt-2">
                  <div className="flex justify-between font-medium text-blue-900">
                    <span>Total Amount:</span>
                    <span className="text-xl">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Methods Selection */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                  Choose Payment Method
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Click any method to complete your booking instantly (Test
                  Mode)
                </p>

                {/* Simple Test Button */}
                <div className="mb-6">
                  <button
                    onClick={() => simulatePaymentClick("test")}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl p-4 hover:from-green-600 hover:to-blue-600 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🚀</div>
                      <div className="font-bold text-lg">TEST PAYMENT</div>
                      <div className="text-sm opacity-90 mt-1">
                        Complete booking instantly (No real payment)
                      </div>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={() => simulatePaymentClick("card")}
                    disabled={loading}
                    className="bg-white border-2 border-blue-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg hover:scale-105 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">💳</div>
                      <div className="font-semibold text-gray-900 group-hover:text-blue-700">
                        Card
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Instant Pay
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => simulatePaymentClick("upi")}
                    disabled={loading}
                    className="bg-white border-2 border-green-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg hover:scale-105 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">📱</div>
                      <div className="font-semibold text-gray-900 group-hover:text-green-700">
                        UPI
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Quick Pay
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => simulatePaymentClick("netbanking")}
                    disabled={loading}
                    className="bg-white border-2 border-purple-200 rounded-xl p-4 hover:border-purple-500 hover:shadow-lg hover:scale-105 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🏦</div>
                      <div className="font-semibold text-gray-900 group-hover:text-purple-700">
                        Bank
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Net Banking
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => simulatePaymentClick("wallet")}
                    disabled={loading}
                    className="bg-white border-2 border-orange-200 rounded-xl p-4 hover:border-orange-500 hover:shadow-lg hover:scale-105 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">📲</div>
                      <div className="font-semibold text-gray-900 group-hover:text-orange-700">
                        Wallet
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Digital Wallet
                      </div>
                    </div>
                  </button>
                </div>

                {loading && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-sm font-medium text-blue-700">
                        Processing Payment...
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-center text-xs text-green-600 border-t border-blue-200 pt-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  ✅ Test Mode - No Real Payment Required
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
