"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminAPI } from "../../../lib/api";

interface Stats {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  revenue: number;
  pendingBookings: number;
  completedBookings: number;
  activeProviders: number;
  platformEarnings: number;
}

interface RecentActivity {
  id: string;
  type: "booking" | "user" | "provider" | "payout";
  action: string;
  user: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    revenue: 0,
    pendingBookings: 0,
    completedBookings: 0,
    activeProviders: 0,
    platformEarnings: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>(
    []
  );
  const [timeRange, setTimeRange] = useState<string>("30days");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch real stats from backend
        const statsResponse = await adminAPI.getStats(timeRange);
        setStats(statsResponse.data);

        // Fetch recent activities
        const activitiesResponse = await adminAPI.getRecentActivities(10);
        setRecentActivities(activitiesResponse.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Keep default values on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return (
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
        );
      case "user":
        return (
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        );
      case "provider":
        return (
          <svg
            className="w-5 h-5 text-purple-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
            />
          </svg>
        );
      case "payout":
        return (
          <svg
            className="w-5 h-5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="bg-gray-200 rounded-xl p-6 h-32"
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-200 rounded-xl p-6 h-80"></div>
              <div className="bg-gray-200 rounded-xl p-6 h-80"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Platform overview and management</p>
        </div>

        {/* Time Range Filter */}
        <div className="mb-6 flex justify-end">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="year">This year</option>
          </select>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Clients
                </h2>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.totalUsers)}
                </p>
                <p className="text-sm text-gray-500 mt-1">Registered users</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Service Providers
                </h2>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.totalProviders)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.activeProviders} active
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
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
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Total Bookings
                </h2>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(stats.totalBookings)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.pendingBookings} pending
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-50 text-green-600">
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Platform Revenue
                </h2>
                <p className="text-2xl font-bold text-amber-600">
                  {formatCurrency(stats.platformEarnings)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  From {formatNumber(stats.completedBookings)} bookings
                </p>
              </div>
              <div className="p-3 rounded-lg bg-amber-50 text-amber-600">
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
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  href="/dashboard/admin/users"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-blue-100 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Manage Users</h3>
                    <p className="text-sm text-gray-500">
                      View and manage all users
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/admin/providers"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Manage Providers
                    </h3>
                    <p className="text-sm text-gray-500">
                      Approve and manage providers
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/admin/bookings"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-green-100 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Manage Bookings
                    </h3>
                    <p className="text-sm text-gray-500">
                      View and manage all bookings
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/admin/payouts"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-yellow-100 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Handle Payouts
                    </h3>
                    <p className="text-sm text-gray-500">
                      Process provider payments
                    </p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/admin/settings"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-500 hover:shadow-md transition-all"
                >
                  <div className="p-2 bg-gray-100 rounded-lg mr-4">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Platform Settings
                    </h3>
                    <p className="text-sm text-gray-500">
                      Configure platform options
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Activity
                </h2>
                <Link
                  href="/dashboard/admin/activity"
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  View all activity →
                </Link>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="p-2 bg-gray-100 rounded-lg mr-4">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-500">
                        By {activity.user}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-6">
            Revenue Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(stats.revenue)}
              </p>
              <p className="text-sm text-gray-600">Total Revenue</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.platformEarnings)}
              </p>
              <p className="text-sm text-gray-600">Platform Earnings</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(stats.revenue - stats.platformEarnings)}
              </p>
              <p className="text-sm text-gray-600">Provider Payouts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
