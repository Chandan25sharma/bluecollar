"use client";

import { useState } from "react";
import AdminHeader from "../../../../components/AdminHeader";

interface Payout {
  id: string;
  provider: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
  service: string;
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "1",
      provider: "Jane Smith",
      amount: 120,
      status: "pending",
      date: "2023-05-15",
      service: "Consultation",
    },
    {
      id: "2",
      provider: "Alex Johnson",
      amount: 80,
      status: "paid",
      date: "2023-05-14",
      service: "Therapy Session",
    },
    {
      id: "3",
      provider: "Maria Garcia",
      amount: 150,
      status: "pending",
      date: "2023-05-16",
      service: "Coaching",
    },
    {
      id: "4",
      provider: "David Kim",
      amount: 95,
      status: "pending",
      date: "2023-05-16",
      service: "Workshop",
    },
  ]);

  const [filter, setFilter] = useState<"all" | "pending" | "paid">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("bank_transfer");
  const [transactionId, setTransactionId] = useState("");
  const [transactionError, setTransactionError] = useState("");

  const markAsPaid = (id: string) => {
    setPayouts(
      payouts.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
    );
    setShowPaymentModal(false);
    setSelectedPayout(null);
  };

  const openPaymentModal = (payout: Payout) => {
    setSelectedPayout(payout);
    setShowPaymentModal(true);
    setTransactionId("");
    setTransactionError("");
  };

  const handlePaymentSubmit = () => {
    if (!transactionId.trim()) {
      setTransactionError("Transaction ID is required");
      return;
    }

    if (selectedPayout) {
      markAsPaid(selectedPayout.id);
    }
  };

  const filteredPayouts = payouts.filter((payout) => {
    const matchesFilter = filter === "all" || payout.status === filter;
    const matchesSearch =
      payout.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.service.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPending = payouts
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="p-6 pb-20 md:pb-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Payout Management
          </h1>
          <p className="text-gray-600 mb-8">
            Manage provider payments and transactions
          </p>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Pending
                </h3>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  Pending
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${totalPending}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {payouts.filter((p) => p.status === "pending").length} payouts
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Paid
                </h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Completed
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${totalPaid}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {payouts.filter((p) => p.status === "paid").length} payouts
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center">
                <h3 className="text-gray-500 text-sm font-medium">
                  Total Processed
                </h3>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  All
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-2">
                ${totalPending + totalPaid}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                {payouts.length} payouts
              </p>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "all"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  All Payouts
                </button>
                <button
                  onClick={() => setFilter("pending")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setFilter("paid")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    filter === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Paid
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search providers or services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Payouts Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Provider
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
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
                  {filteredPayouts.length > 0 ? (
                    filteredPayouts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="font-medium text-blue-700">
                                {p.provider.charAt(0)}
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {p.provider}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {p.service}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{p.date}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            ${p.amount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              p.status === "paid"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {p.status === "pending" ? (
                            <button
                              onClick={() => openPaymentModal(p)}
                              className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-sm font-medium"
                            >
                              Process Payment
                            </button>
                          ) : (
                            <span className="text-green-600">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No payouts found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Process Payment
              </h2>
              <p className="text-gray-600 mb-6">
                Complete the payment for {selectedPayout.provider}
              </p>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  {selectedPayout.provider}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <div className="bg-gray-50 p-3 rounded-lg">
                  ${selectedPayout.amount}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="wise">Wise</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => {
                    setTransactionId(e.target.value);
                    setTransactionError("");
                  }}
                  className={`w-full p-3 border ${
                    transactionError ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Enter transaction reference"
                />
                {transactionError && (
                  <p className="mt-1 text-sm text-red-600">
                    {transactionError}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaymentSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
