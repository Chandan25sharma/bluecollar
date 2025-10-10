"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import {
  FiClock,
  FiGrid,
  FiHeart,
  FiShield,
  FiStar,
  FiZap,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function FeaturesSection() {
  const featuresRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const features = featuresRef.current;
    if (!features) return;

    // Stagger animation for feature cards
    gsap.fromTo(
      ".feature-card",
      { opacity: 0, y: 60, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: features,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating animation for icons
    gsap.to(".feature-icon", {
      y: "random(-5, 5)",
      rotation: "random(-3, 3)",
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const features = [
    {
      icon: FiShield,
      title: "Verified Providers",
      description:
        "All service providers are thoroughly vetted and background-checked for your safety and peace of mind.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: FiZap,
      title: "Instant Booking",
      description:
        "Book services instantly with real-time availability. No more waiting for callbacks or scheduling conflicts.",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: FiHeart,
      title: "Quality Guaranteed",
      description:
        "100% satisfaction guarantee on all services. If you're not happy, we'll make it right or refund your money.",
      color: "from-pink-500 to-pink-600",
    },
    {
      icon: FiStar,
      title: "Top Rated",
      description:
        "Access to the highest-rated professionals in your area based on real customer reviews and ratings.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiClock,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you with any questions or issues, anytime you need assistance.",
      color: "from-teal-500 to-teal-600",
    },
    {
      icon: FiGrid,
      title: "All Services",
      description:
        "From home repairs to professional services, find everything you need in one convenient platform.",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section
      ref={featuresRef}
      className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative z-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              BlueCollar
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've built the most trusted platform for connecting customers with
            professional service providers. Here's what makes us different.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="relative bg-white rounded-3xl p-8 h-full transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 hover:border-blue-200 overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                ></div>

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="feature-icon text-2xl text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
            Start Using BlueCollar Today
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
