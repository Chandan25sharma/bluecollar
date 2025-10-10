"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FiCalendar, FiCheckCircle, FiSearch, FiUser } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function HowItWorksSection() {
  const howItWorksRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = howItWorksRef.current;
    if (!section) return;

    // Step cards animation
    gsap.fromTo(
      ".step-card",
      { opacity: 0, x: -50, scale: 0.9 },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Connecting lines animation
    gsap.fromTo(
      ".step-line",
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.2,
        delay: 0.5,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      }
    );

    // Floating animation for step numbers
    gsap.to(".step-number", {
      y: "random(-3, 3)",
      rotation: "random(-2, 2)",
      duration: 2,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.5,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const steps = [
    {
      number: "01",
      icon: FiSearch,
      title: "Search & Browse",
      description:
        "Find the perfect service provider by searching our extensive database of verified professionals in your area.",
      color: "from-blue-500 to-blue-600",
    },
    {
      number: "02",
      icon: FiUser,
      title: "Compare & Select",
      description:
        "Review profiles, ratings, and prices to choose the best provider that matches your needs and budget.",
      color: "from-purple-500 to-purple-600",
    },
    {
      number: "03",
      icon: FiCalendar,
      title: "Book & Schedule",
      description:
        "Schedule your service instantly with real-time availability. Get confirmation and provider details immediately.",
      color: "from-teal-500 to-teal-600",
    },
    {
      number: "04",
      icon: FiCheckCircle,
      title: "Complete & Review",
      description:
        "Enjoy quality service from verified professionals. Rate your experience to help other customers.",
      color: "from-green-500 to-green-600",
    },
  ];

  return (
    <section
      ref={howItWorksRef}
      className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative z-20"
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
            How It{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting the help you need has never been easier. Follow these simple
            steps to connect with trusted professionals.
          </p>
        </motion.div>

        {/* Desktop Steps */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2">
              {steps.slice(0, -1).map((_, index) => (
                <div
                  key={index}
                  className="step-line absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 origin-left"
                  style={{
                    left: `${(index * 100) / (steps.length - 1)}%`,
                    width: `${100 / (steps.length - 1)}%`,
                  }}
                ></div>
              ))}
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={index} className="step-card text-center">
                  <div className="relative mb-8">
                    {/* Step Number */}
                    <div
                      className={`step-number w-20 h-20 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl relative z-10`}
                    >
                      <span className="text-2xl font-bold text-white">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-xl border border-gray-100">
                      <step.icon className="text-2xl text-gray-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Steps */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="step-card">
              <div className="flex items-start gap-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div
                    className={`step-number w-16 h-16 bg-gradient-to-r ${step.color} rounded-xl flex items-center justify-center mb-4`}
                  >
                    <span className="text-xl font-bold text-white">
                      {step.number}
                    </span>
                  </div>
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    <step.icon className="text-xl text-gray-700" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting Line for Mobile */}
              {index < steps.length - 1 && (
                <div className="flex justify-center py-4">
                  <div className="w-1 h-8 bg-gradient-to-b from-purple-300 to-pink-300 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to get started?
            </h3>
            <p className="text-gray-600 mb-6">
              Join thousands of satisfied customers who trust BlueCollar for
              their service needs.
            </p>
            <button className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-purple-500/25">
              Start Your First Booking
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
