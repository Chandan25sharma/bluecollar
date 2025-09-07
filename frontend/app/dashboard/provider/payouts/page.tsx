"use client";

import ProviderHeader from "components/ProviderHeader";
import { useState } from "react";
import {
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiChevronDown,
  FiInfo,
  FiX,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { motion } from "framer-motion";

interface Payout {
  id: string;
  amount: number;
  status: "pending" | "processing" | "paid" | "failed";
  date: string;
  method: string;
  transactionId?: string;
  servicePeriod: string;
}

interface EarningsSummary {
  totalEarnings: number;
  availableBalance: number;
  pendingPayouts: number;
  lastPayout: number;
}

export default function ProviderPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([
    {
      id: "1",
      amount: 1200,
      status: "paid",
      date: "2025-08-01",
      method: "Bank Transfer",
      transactionId: "TX123456789",
      servicePeriod: "Jul 15 - Jul 31, 2025",
    },
    {
      id: "2",
      amount: 850,
      status: "processing",
      date: "2025-08-10",
      method: "PayPal",
      servicePeriod: "Aug 1 - Aug 7, 2025",
    },
    {
      id: "3",
      amount: 1560,
      status: "paid",
      date: "2025-07-15",
      method: "Bank Transfer",
      transactionId: "TX987654321",
      servicePeriod: "Jul 1 - Jul 14, 2025",
    },
    {
      id: "4",
      amount: 920,
      status: "pending",
      date: "2025-08-15",
      method: "Direct Deposit",
      servicePeriod: "Aug 8 - Aug 14, 2025",
    },
    {
      id: "5",
      amount: 1100,
      status: "paid",
      date: "2025-06-30",
      method: "PayPal",
      transactionId: "TX456789123",
      servicePeriod: "Jun 15 - Jun 30, 2025",
    },
    {
      id: "6",
      amount: 750,
      status: "failed",
      date: "2025-06-15",
      method: "Bank Transfer",
      servicePeriod: "Jun 1 - Jun 14, 2025",
    },
  ]);

  const [earningsSummary] = useState<EarningsSummary>({
    totalEarnings: 6380,
    availableBalance: 1770,
    pendingPayouts: 850,
    lastPayout: 1200,
  });

  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("30days");

  const statusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <FiCheckCircle className="h-4 w-4" />;
      case "processing":
        return <FiClock className="h-4 w-4" />;
      case "pending":
        return <FiClock className="h-4 w-4" />;
      case "failed":
        return <FiAlertCircle className="h-4 w-4" />;
      default:
        return <FiInfo className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredPayouts = payouts.filter(
    (payout) => filter === "all" || payout.status === filter
  );

  const getStatusCount = (status: string) => {
    return payouts.filter((payout) => payout.status === status).length;
  };

  const requestPayout = () => {
    if (earningsSummary.availableBalance > 0) {
      alert(
        `Payout request for ${formatCurrency(
          earningsSummary.availableBalance
        )} has been submitted!`
      );
    } else {
      alert("No available balance to payout.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-8xl mx-auto px-0 sm:px-0 lg:px-0 py-0">
        {/* Header */}
        <ProviderHeader />

        {/* Earnings Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { label: "Total Earnings", value: earningsSummary.totalEarnings },
            {
              label: "Available Balance",
              value: earningsSummary.availableBalance,
            },
            { label: "Pending Payouts", value: earningsSummary.pendingPayouts },
            { label: "Last Payout", value: earningsSummary.lastPayout },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-100 p-2 flex flex-col items-center justify-center hover:shadow-md transition-all"
            >
              <p className="text-xs font-medium text-gray-500 uppercase">
                {stat.label}
              </p>
              <p className="text-base sm:text-lg font-semibold text-gray-900 mt-1">
                {formatCurrency(stat.value)}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Payout Action Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-teal-500 rounded-2xl p-4 sm:p-6 mb-8 text-white shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-6">
            {/* Text Section */}
            <div className="flex-1">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold mb-1">
                Ready to get paid?
              </h2>
              <p className="text-xs sm:text-sm opacity-90">
                Request a payout of your available balance
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1">
                {formatCurrency(earningsSummary.availableBalance)} available
              </p>
            </div>

            {/* Button */}
            <div className="flex-shrink-0">
              <button
                onClick={requestPayout}
                disabled={earningsSummary.availableBalance === 0}
                className="w-full sm:w-auto px-4 py-2 sm:px-5 sm:py-2.5 text-sm sm:text-base bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request Payout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Payout History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 lg:gap-4">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  Payout History
                </h2>
                <p className="text-[12px] text-gray-500">
                  Your transaction history and payments
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="appearance-none w-full sm:w-auto bg-gray-100 border border-gray-300 text-gray-700 py-1 px-4 pr-8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="7days">Last 7 days</option>
                    <option value="30days">Last 30 days</option>
                    <option value="90days">Last 90 days</option>
                    <option value="year">This year</option>
                    <option value="all">All time</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FiChevronDown className="h-4 w-4" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["all", "paid", "processing", "pending"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-2 py-1 rounded-xl text-sm font-medium transition-all ${
                        filter === f
                          ? "bg-green-100 text-green-700 shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)} (
                      {getStatusCount(f)})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payout List */}
          <div className="p-0 sm:p-6">
            {filteredPayouts.length === 0 ? (
              <div className="text-center py-12 ">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <FiDollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No payouts found
                </h3>
                <p className="mt-2 text-gray-500">
                  {filter === "all"
                    ? "You don't have any payout history yet."
                    : `You don't have any ${filter} payouts.`}
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service Period
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayouts.map((payout) => (
                        <tr
                          key={payout.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatDate(payout.date)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {payout.servicePeriod}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(payout.amount)}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {payout.method}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                                payout.status
                              )}`}
                            >
                              {statusIcon(payout.status)}
                              <span className="ml-1 capitalize">
                                {payout.status}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <button
                              onClick={() => setSelectedPayout(payout)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile List */}
                <div className="md:hidden space-y-3">
                  {filteredPayouts.map((payout) => (
                    <div
                      key={payout.id}
                      className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(payout.date)}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(
                            payout.status
                          )}`}
                        >
                          {payout.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 mb-1">
                        {payout.servicePeriod}
                      </div>
                      <div className="text-sm font-semibold text-green-600 mb-1">
                        {formatCurrency(payout.amount)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {payout.method}
                      </div>
                      <button
                        onClick={() => setSelectedPayout(payout)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Payout Details Modal */}
        {selectedPayout && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Payout Details
                </h3>
                <button
                  onClick={() => setSelectedPayout(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Amount
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(selectedPayout.amount)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Status
                  </label>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(
                      selectedPayout.status
                    )}`}
                  >
                    {statusIcon(selectedPayout.status)}
                    <span className="ml-1 capitalize">
                      {selectedPayout.status}
                    </span>
                  </span>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedPayout.date)}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Service Period
                  </label>
                  <p className="text-gray-900">
                    {selectedPayout.servicePeriod}
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Payment Method
                  </label>
                  <p className="text-gray-900">{selectedPayout.method}</p>
                </div>

                {selectedPayout.transactionId && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Transaction ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm">
                      {selectedPayout.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
