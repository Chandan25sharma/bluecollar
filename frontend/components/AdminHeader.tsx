"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiBarChart,
  FiFileText,
  FiHome,
  FiLogOut,
  FiSettings,
  FiShield,
  FiTool,
  FiUsers,
} from "react-icons/fi";
import NotificationBell from "./NotificationBell";

export default function AdminHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Top Nav */}
      <nav
        className={`bg-white py-3 px-2 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        {/* Logo / Brand */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-bold text-red-600 flex items-center"
        >
          <span className="bg-gradient-to-r from-red-600 to-rose-500 text-white p-1 rounded mr-2">
            <FiShield size={14} />
          </span>
          Admin Dashboard
        </motion.h1>

        {/* Desktop Links */}
        <div className="hidden md:flex ml-8 space-x-6">
          <a
            href="/dashboard/admin"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiHome size={16} />
            Dashboard
          </a>
          <a
            href="/dashboard/admin/users"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiUsers size={16} />
            Users
          </a>
          <a
            href="/dashboard/admin/providers"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiShield size={16} />
            Providers
          </a>
          <a
            href="/dashboard/admin/services"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiTool size={16} />
            Services
          </a>
          <a
            href="/dashboard/admin/bookings"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiFileText size={16} />
            Bookings
          </a>
          <a
            href="/dashboard/admin/analytics"
            className="text-gray-700 hover:text-red-600 font-medium text-sm flex items-center gap-1"
          >
            <FiBarChart size={16} />
            Analytics
          </a>
        </div>

        {/* Profile / Settings */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Notification Bell */}
          <NotificationBell />

          <a
            href="/dashboard/admin/settings"
            className="text-gray-500 hover:text-red-600 transition-colors"
            title="Settings"
          >
            <FiSettings size={18} />
          </a>

          {/* Admin Profile Dropdown */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center">
              <FiShield className="text-white" size={14} />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin</span>
          </div>

          <a
            href="/login"
            className="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <FiLogOut size={14} />
            Logout
          </a>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 flex justify-around items-center h-16 md:hidden"
      >
        <a
          href="/dashboard/admin"
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <FiHome size={20} />
          <span className="text-xs">Dashboard</span>
        </a>
        <a
          href="/dashboard/admin/users"
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <FiUsers size={20} />
          <span className="text-xs">Users</span>
        </a>
        <a
          href="/dashboard/admin/providers"
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <FiShield size={20} />
          <span className="text-xs">Providers</span>
        </a>
        <a
          href="/dashboard/admin/services"
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <FiTool size={20} />
          <span className="text-xs">Services</span>
        </a>
        <a
          href="/dashboard/admin/analytics"
          className="flex flex-col items-center text-gray-600 hover:text-red-600 transition-colors"
        >
          <FiBarChart size={20} />
          <span className="text-xs">Analytics</span>
        </a>
      </motion.nav>
    </>
  );
}
