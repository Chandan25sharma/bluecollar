"use client";

import { useState } from "react";
import { paymentsAPI } from "../lib/api";

// Extend window type for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentProps {
  bookingId: string;
  amount: number;
  providerId: string;
  serviceName: string;
  providerName: string;
  onSuccess?: (paymentData: any) => void;
  onFailure?: (error: any) => void;
  className?: string;
  disabled?: boolean;
}

export default function PaymentButton({
  bookingId,
  amount,
  providerId,
  serviceName,
  providerName,
  onSuccess,
  onFailure,
  className = "",
  disabled = false,
}: PaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Create payment order
      const orderResponse = await paymentsAPI.createOrder(
        bookingId,
        amount,
        providerId
      );
      const orderData = orderResponse.data;

      // Configure Razorpay options
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || "INR",
        name: "BlueCollar Services",
        description: `Payment for ${serviceName}`,
        image: "/logo.png", // Add your logo
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await paymentsAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verificationResponse.data.success) {
              onSuccess?.(verificationResponse.data);
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (verifyError) {
            console.error("Payment verification failed:", verifyError);
            onFailure?.(verifyError);
            setError("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: "", // Will be filled from user context
          email: "", // Will be filled from user context
          contact: "", // Will be filled from user context
        },
        notes: {
          booking_id: bookingId,
          service: serviceName,
          provider: providerName,
        },
        theme: {
          color: "#0E7490", // BlueCollar brand color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            onFailure?.({ message: "Payment cancelled by user" });
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        setError(`Payment failed: ${response.error.description}`);
        onFailure?.(response.error);
        setLoading(false);
      });

      rzp.open();
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      setError(error.response?.data?.message || "Failed to initiate payment");
      onFailure?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={loading || disabled}
        className={`w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors ${className}`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
            Processing Payment...
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z"
              />
            </svg>
            Pay ₹{amount.toLocaleString()}
          </>
        )}
      </button>

      <div className="mt-3 flex items-center justify-center text-sm text-gray-500">
        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Secured by Razorpay
      </div>
    </div>
  );
}
