"use client";

import { useState } from "react";
import {
  FiBarChart,
  FiCalendar,
  FiDollarSign,
  FiDownload,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import AdminHeader from "../../../../components/AdminHeader";

export default function AdminReportsPage() {
  const [dateRange, setDateRange] = useState("30days");
  const [reportType, setReportType] = useState("overview");

  // Mock data for demonstration
  const stats = {
    totalRevenue: 45230,
    totalBookings: 324,
    activeUsers: 1250,
    growthRate: 12.5,
  };

  const downloadReport = (type: string) => {
    // Mock download functionality
    alert(`Downloading ${type} report...`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <AdminHeader />
      <div className="p-6 pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Reports & Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive platform insights and reports
            </p>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>

              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                <option value="overview">Overview</option>
                <option value="revenue">Revenue</option>
                <option value="users">Users</option>
                <option value="bookings">Bookings</option>
              </select>

              <button
                onClick={() => downloadReport(reportType)}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
              >
                <FiDownload size={16} />
                Download Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiDollarSign className="text-green-600" size={24} />
                </div>
                <span className="text-green-600 text-sm font-medium">
                  +{stats.growthRate}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-gray-600 text-sm">Total Revenue</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiCalendar className="text-blue-600" size={24} />
                </div>
                <span className="text-blue-600 text-sm font-medium">+8.2%</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.totalBookings}
              </h3>
              <p className="text-gray-600 text-sm">Total Bookings</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FiUsers className="text-purple-600" size={24} />
                </div>
                <span className="text-purple-600 text-sm font-medium">
                  +15.3%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.activeUsers.toLocaleString()}
              </h3>
              <p className="text-gray-600 text-sm">Active Users</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FiTrendingUp className="text-orange-600" size={24} />
                </div>
                <span className="text-orange-600 text-sm font-medium">
                  +{stats.growthRate}%
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {stats.growthRate}%
              </h3>
              <p className="text-gray-600 text-sm">Growth Rate</p>
            </div>
          </div>

          {/* Report Content */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <FiBarChart className="text-red-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">
                Detailed Analytics
              </h2>
            </div>

            {/* Placeholder for charts/graphs */}
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <FiBarChart className="text-gray-400 mx-auto mb-2" size={48} />
                <p className="text-gray-500">
                  Analytics charts will be displayed here
                </p>
                <p className="text-gray-400 text-sm">
                  Integration with charting library needed
                </p>
              </div>
            </div>

            {/* Quick Stats Table */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Key Metrics
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Metric
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Current Period
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Previous Period
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Revenue</td>
                      <td className="py-3 px-4">
                        ${stats.totalRevenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">$40,200</td>
                      <td className="py-3 px-4 text-green-600">+12.5%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">Bookings</td>
                      <td className="py-3 px-4">{stats.totalBookings}</td>
                      <td className="py-3 px-4">299</td>
                      <td className="py-3 px-4 text-green-600">+8.4%</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4">New Users</td>
                      <td className="py-3 px-4">156</td>
                      <td className="py-3 px-4">123</td>
                      <td className="py-3 px-4 text-green-600">+26.8%</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Conversion Rate</td>
                      <td className="py-3 px-4">3.2%</td>
                      <td className="py-3 px-4">2.8%</td>
                      <td className="py-3 px-4 text-green-600">+14.3%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
