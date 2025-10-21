"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiSearch, FiUsers, FiTool, FiStar, FiCheckCircle } from "react-icons/fi";
import Link from "next/link";

interface HeroSectionProps {
  providersCount?: number;
  servicesCount?: number;
}

export default function HeroSection({ providersCount, servicesCount }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="floating-element absolute top-1/4 left-1/4 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="floating-element absolute top-3/4 right-1/4 w-40 h-40 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="floating-element absolute bottom-1/4 left-1/2 w-36 h-36 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-emerald-900/50 to-teal-800/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Trusted{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Service Providers
            </span>{" "}
            Near You
          </h1>
          <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with verified professionals for all your home and business
            needs. Quality service, trusted reviews, instant booking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <Link
            href="/signup"
            className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-2"
          >
            Get Started
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="group border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2"
          >
            <FiSearch className="group-hover:rotate-12 transition-transform" />
            Browse Services
          </Link>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
        >
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <FiUsers className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {providersCount || 50}+
            </div>
            <div className="text-sm text-green-100">Verified Providers</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <FiTool className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">
              {servicesCount || 100}+
            </div>
            <div className="text-sm text-green-100">Services Available</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <FiStar className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">4.9</div>
            <div className="text-sm text-green-100">Average Rating</div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <FiCheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-3xl font-bold text-white">100%</div>
            <div className="text-sm text-green-100">Satisfaction</div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="What service do you need? (e.g., plumber, electrician, cleaner)"
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-green-500/30 focus:border-green-500 text-gray-800 text-lg placeholder-gray-500 transition-all duration-300"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              Search
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}