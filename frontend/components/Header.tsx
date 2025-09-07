"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiMenu, FiX, FiGrid, FiHome, FiTool, FiUser, FiClock } from "react-icons/fi";

interface HeaderProps {}

export default function Header({}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setScrolled(true);
      else setScrolled(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={`bg-white py-3 px-4 flex justify-between items-center sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "shadow-lg" : "shadow-sm"
        }`}
      >
        <div className="flex items-center">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold text-green-600 flex items-center"
          >
            <span className="bg-gradient-to-r from-green-600 to-teal-500 text-white p-1 rounded mr-2">
              <FiGrid size={14} />
            </span>
            SkillServe
          </motion.h1>
          <div className="hidden md:flex ml-8 space-x-6">
            <a
              href="#"
              className="text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200"
            >
              Home
            </a>
            <a
              href="/services"
              className="text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200"
            >
              Services
            </a>
            <a
              href="how-it-works"
              className="text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200"
            >
              How It Works
            </a>
            <a
              href="about-us"
              className="text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200"
            >
              About Us
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-3">
          <a
            href="/login"
            className="text-gray-700 hover:text-green-600 font-medium text-sm transition-colors duration-200"
          >
            Log In
          </a>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="/signup"
            className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-4 py-2 rounded-md font-medium hover:shadow-md transition-all text-sm"
          >
            Sign Up
          </motion.a>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(true)}
        >
          <FiMenu size={20} />
        </motion.button>
      </nav>

   {/* Mobile Menu - Bottom Tab Bar (Always visible on mobile) */}
<motion.nav
  initial={{ y: 100 }}
  animate={{ y: 0 }}
  exit={{ y: 100 }}
  className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 flex justify-around items-center h-16 md:hidden"
>
  <a href="/#" className="flex flex-col items-center text-gray-600 hover:text-green-600">
    <FiHome size={20} />
    <span className="text-xs">Home</span>
  </a>

  <a href="/services" className="flex flex-col items-center text-gray-600 hover:text-green-600">
    <FiTool size={20} />
    <span className="text-xs">Services</span>
  </a>

  <a href="/how-it-works" className="flex flex-col items-center text-gray-600 hover:text-green-600">
    <FiClock size={20} />
    <span className="text-xs">Works</span>
  </a>

  <a href="about-us" className="flex flex-col items-center text-gray-600 hover:text-green-600">
    <FiUser size={20} />
    <span className="text-xs">About</span>
  </a>
</motion.nav>

    </>
  );
}
