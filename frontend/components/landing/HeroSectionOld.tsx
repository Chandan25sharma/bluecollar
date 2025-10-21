"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FiArrowRight, FiSearch } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  providersCount: number;
  servicesCount: number;
}

export default function HeroSection({
  providersCount,
  servicesCount,
}: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    // Hero parallax effect
    gsap.to(hero, {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Floating elements animation
    gsap.to(".floating-element", {
      y: "random(-20, 20)",
      x: "random(-10, 10)",
      rotation: "random(-5, 5)",
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-green-900 via-emerald-900 to-teal-800"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="floating-element absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="floating-element absolute top-3/4 right-1/4 w-40 h-40 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="floating-element absolute bottom-1/4 left-1/2 w-36 h-36 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-teal-800/50"></div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Find Trusted{" "}
            <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
              Service Providers
            </span>{" "}
            Near You
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with verified professionals for all your home and business
            needs. Quality service, trusted reviews, instant booking.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
        >
          <button className="group bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 flex items-center gap-2">
            Get Started
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="group border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 flex items-center gap-2">
            <FiSearch className="group-hover:rotate-12 transition-transform" />
            Browse Services
          </button>
        </motion.div>

        {/* Development Testing Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="bg-black/30 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20"
        >
          <div className="text-yellow-300 text-sm font-semibold mb-4 flex items-center gap-2">
            🚧 Development Testing - Quick Access
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <a
              href="/login"
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              🔐 Login
            </a>
            <a
              href="/client-signup"
              className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              👤 Client Signup
            </a>
            <a
              href="/provider-signup"
              className="bg-purple-500/80 hover:bg-purple-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              🛠️ Provider Signup
            </a>
            <a
              href="/dashboard/admin"
              className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              👑 Admin Dashboard
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            <a
              href="/dashboard/client"
              className="bg-teal-500/80 hover:bg-teal-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              📱 Client Dashboard
            </a>
            <a
              href="/dashboard/provider"
              className="bg-indigo-500/80 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              🔧 Provider Dashboard
            </a>
            <a
              href="/services"
              className="bg-green-500/80 hover:bg-green-500 text-white px-4 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 text-center text-sm"
            >
              🏪 Browse Services
            </a>
          </div>
          <div className="text-xs text-white/60 mt-3 text-center">
            Test Credentials: admin@bluecollar.com | client@test.com |
            provider1@test.com | Password: password123
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative max-w-2xl mx-auto"
        >
          <div className="relative group">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="What service do you need? (e.g., plumber, electrician, cleaner)"
              className="w-full pl-16 pr-6 py-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-800 text-lg placeholder-gray-500 transition-all duration-300"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
              Search
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16 text-white/80"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">10K+</div>
            <div className="text-sm">Active Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">50K+</div>
            <div className="text-sm">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">100+</div>
            <div className="text-sm">Service Categories</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">4.9★</div>
            <div className="text-sm">Average Rating</div>
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
