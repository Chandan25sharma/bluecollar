import { useState } from "react";

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  amount: number;
  onPaymentComplete: (paymentData: any) => void;
  onCancel: () => void;
  loading: boolean;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Credit/Debit Card",
    icon: "💳",
    description: "Pay securely with your card",
  },
  {
    id: "upi",
    name: "UPI",
    icon: "📱",
    description: "Pay using UPI apps like GPay, PhonePe",
  },
  {
    id: "netbanking",
    name: "Net Banking",
    icon: "🏦",
    description: "Pay via your bank account",
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: "💰",
    description: "Pay using Paytm, Amazon Pay",
  },
];

export default function PaymentMethodSelector({
  amount,
  onPaymentComplete,
  onCancel,
  loading,
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (methodId: string) => {
    setProcessing(true);
    setSelectedMethod(methodId);

    try {
      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate successful payment for testing
      const mockPaymentData = {
        paymentId: `test_payment_${Date.now()}`,
        orderId: `test_order_${Date.now()}`,
        method: methodId,
        amount: amount,
        status: "SUCCESS",
        timestamp: new Date().toISOString(),
      };

      onPaymentComplete(mockPaymentData);
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setProcessing(false);
      setSelectedMethod("");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Choose Payment Method
            </h2>
            <button
              onClick={onCancel}
              disabled={processing || loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
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

          {/* Amount */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="text-center">
              <p className="text-sm text-blue-600 mb-1">Amount to Pay</p>
              <p className="text-2xl font-bold text-blue-900">
                ${amount.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3 mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Select a payment method:
            </p>

            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => handlePayment(method.id)}
                disabled={processing || loading}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed ${
                  selectedMethod === method.id && processing
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{method.icon}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {method.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                  {selectedMethod === method.id && processing && (
                    <div className="ml-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                  {selectedMethod !== method.id && !processing && (
                    <div className="ml-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Test Mode Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <div className="flex items-start">
              <svg
                className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-yellow-800">Test Mode</p>
                <p className="text-xs text-yellow-700">
                  This is a simulated payment for testing. No actual payment
                  will be processed.
                </p>
              </div>
            </div>
          </div>

          {/* Cancel Button */}
          <button
            onClick={onCancel}
            disabled={processing || loading}
            className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
