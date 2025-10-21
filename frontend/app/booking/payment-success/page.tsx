"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PaymentSuccessPage() {
  const [status, setStatus] = useState<
    "loading" | "success" | "failed" | "error"
  >("loading");
  const [booking, setBooking] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const orderId = searchParams.get("order_id");
        const paymentId = searchParams.get("payment_id");

        if (!orderId) {
          setStatus("error");
          setError("Missing order information");
          return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Verify payment with backend
        const response = await fetch(
          "http://localhost:4001/api/payments/cashfree/verify",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId,
              paymentId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        const result = await response.json();

        if (result.success) {
          setBooking(result.data.booking);
          setStatus("success");
        } else {
          setStatus("failed");
          setError("Payment verification failed");
        }
      } catch (err: any) {
        console.error("Payment verification error:", err);
        setStatus("failed");
        setError(err.message || "Something went wrong");
      }
    };

    verifyPayment();
  }, [searchParams, router]);

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

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-8">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg
                className="h-8 w-8 text-green-600"
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-lg text-gray-600">
              Your booking has been confirmed and the provider has been
              notified.
            </p>
          </div>

          {booking && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Booking Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Service:</span>
                  <p className="text-gray-900">{booking.service?.title}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">Provider:</span>
                  <p className="text-gray-900">{booking.provider?.name}</p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">
                    Scheduled Date:
                  </span>
                  <p className="text-gray-900">
                    {formatDateTime(booking.date)}
                  </p>
                </div>

                <div>
                  <span className="font-medium text-gray-700">
                    Amount Paid:
                  </span>
                  <p className="text-gray-900 font-medium">
                    {formatPrice(booking.totalAmount)}
                  </p>
                </div>

                {booking.clientAddress && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">
                      Service Address:
                    </span>
                    <p className="text-gray-900">{booking.clientAddress}</p>
                  </div>
                )}

                {booking.notes && (
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Notes:</span>
                    <p className="text-gray-900">{booking.notes}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Booking Status:</strong>{" "}
                  {booking.status === "ACCEPTED" ? "Confirmed" : booking.status}
                </p>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • The provider will contact you to confirm the appointment
              </li>
              <li>
                • You'll receive SMS and email notifications about booking
                updates
              </li>
              <li>• You can track your booking status in your dashboard</li>
              <li>
                • Payment will be released to the provider after service
                completion
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push("/dashboard/client")}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => router.push("/services")}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-medium"
            >
              Book Another Service
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Failed or Error state
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg
            className="h-8 w-8 text-red-600"
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

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment {status === "failed" ? "Failed" : "Error"}
        </h1>

        <p className="text-gray-600 mb-6">
          {error ||
            "There was an issue processing your payment. Please try again."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push("/dashboard/client")}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => router.push("/services")}
            className="bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
