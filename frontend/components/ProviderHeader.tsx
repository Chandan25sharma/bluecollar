"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiMenu,
  FiGrid,
  FiHome,
  FiTool,
  FiUser,
  FiClock,
  FiDollarSign,
  FiSettings,
  FiBookOpen,
} from "react-icons/fi";

export default function ProviderHeader() {
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
          className="text-xl font-bold text-green-600 flex items-center"
        >
          <span className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-1 rounded mr-2">
            <FiGrid size={14} />
          </span>
          Provider Dashboard
        </motion.h1>

        {/* Desktop Links */}
        <div className="hidden md:flex ml-8 space-x-6">
          <a
            href="/dashboard/provider"
            className="text-gray-700 hover:text-green-600 font-medium text-sm"
          >
            Home
          </a>
          <a
            href="/dashboard/provider/bookings"
            className="text-gray-700 hover:text-green-600 font-medium text-sm"
          >
            Bookings
          </a>
          <a
            href="/dashboard/provider/services"
            className="text-gray-700 hover:text-green-600 font-medium text-sm"
          >
            Services
          </a>
          <a
            href="/dashboard/provider/payouts"
            className="text-gray-700 hover:text-green-600 font-medium text-sm"
          >
            Payouts
          </a>
          <a
            href="/dashboard/provider/profile"
            className="text-gray-700 hover:text-green-600 font-medium text-sm"
          >
            Profile
          </a>
        </div>

        {/* Profile / Settings */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="/dashboard/provider/settings"
            className="text-gray-500 hover:text-green-600"
            title="Settings"
          >
            <FiSettings size={18} />
          </a>
          <a
            href="/logout"
            className="text-sm font-medium text-red-500 hover:text-red-600"
          >
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
          href="/dashboard/provider"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
        >
          <FiHome size={20} />
          <span className="text-xs">Home</span>
        </a>
        <a
          href="/dashboard/provider/bookings"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
        >
          <FiBookOpen size={20} />
          <span className="text-xs">Bookings</span>
        </a>

        <a
          href="/dashboard/provider/services"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
        >
          <FiTool size={20} />
          <span className="text-xs">Services</span>
        </a>

        <a
          href="/dashboard/provider/payouts"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
        >
          <FiDollarSign size={20} />
          <span className="text-xs">Payouts</span>
        </a>

        <a
          href="/dashboard/provider/profile"
          className="flex flex-col items-center text-gray-600 hover:text-green-600"
        >
          <FiUser size={20} />
          <span className="text-xs">Profile</span>
        </a>
      </motion.nav>
    </>
  );
}
