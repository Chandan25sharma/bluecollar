"use client";

import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiAward,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

export default function ServicesHeroSection() {
  const stats = [
    {
      icon: FiUsers,
      label: "Active Providers",
      value: "500+",
      color: "text-green-500",
    },
    {
      icon: FiStar,
      label: "Average Rating",
      value: "4.8",
      color: "text-yellow-500",
    },
    {
      icon: FiShield,
      label: "Completed Jobs",
      value: "10K+",
      color: "text-blue-500",
    },
    {
      icon: FiAward,
      label: "Satisfaction Rate",
      value: "98%",
      color: "text-purple-500",
    },
  ];

  return (
    <section className="relative bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Premium{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Services
              </span>{" "}
              Showcase
            </h1>
            <p className="text-xl sm:text-2xl text-green-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover exceptional quality services from verified professionals.
              Every service is crafted to exceed your expectations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <button className="group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-green-500/25 flex items-center gap-2">
              Explore Services
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2">
              <FiTrendingUp className="group-hover:rotate-12 transition-transform" />
              Popular Categories
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-2`} />
                <div className="text-3xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-sm text-green-100">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
