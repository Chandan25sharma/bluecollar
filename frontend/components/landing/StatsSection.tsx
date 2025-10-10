"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FiClock, FiShield, FiStar, FiUsers } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function StatsSection() {
  const statsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stats = statsRef.current;
    if (!stats) return;

    // Fade in animation for stats
    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
          trigger: stats,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Counter animation
    gsap.fromTo(
      ".counter",
      { innerText: 0 },
      {
        innerText: (i: number, el: Element) =>
          el.getAttribute("data-count") || "0",
        duration: 2,
        ease: "power2.out",
        snap: { innerText: 1 },
        scrollTrigger: {
          trigger: stats,
          start: "top 70%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const stats = [
    {
      icon: FiUsers,
      count: "10000",
      suffix: "+",
      label: "Active Service Providers",
      description: "Verified professionals ready to serve you",
    },
    {
      icon: FiStar,
      count: "50000",
      suffix: "+",
      label: "Satisfied Customers",
      description: "Happy clients across all services",
    },
    {
      icon: FiClock,
      count: "24",
      suffix: "/7",
      label: "Customer Support",
      description: "Round-the-clock assistance available",
    },
    {
      icon: FiShield,
      count: "99",
      suffix: "%",
      label: "Success Rate",
      description: "Jobs completed successfully",
    },
  ];

  return (
    <section ref={statsRef} className="py-20 bg-white relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform connects you with the best service providers, backed by
            real results and satisfied customers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item text-center group">
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 border border-gray-100 hover:border-blue-200">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="text-2xl text-white" />
                </div>

                {/* Count */}
                <div className="mb-4">
                  <span className="text-4xl lg:text-5xl font-bold text-gray-900">
                    <span className="counter" data-count={stat.count}>
                      0
                    </span>
                    <span className="text-blue-600">{stat.suffix}</span>
                  </span>
                </div>

                {/* Label */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed">
                  {stat.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-teal-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional trust indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 mb-8">
            Trusted by leading companies and organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Company logos placeholder */}
            <div className="w-32 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                Company 1
              </span>
            </div>
            <div className="w-32 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                Company 2
              </span>
            </div>
            <div className="w-32 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                Company 3
              </span>
            </div>
            <div className="w-32 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">
                Company 4
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
