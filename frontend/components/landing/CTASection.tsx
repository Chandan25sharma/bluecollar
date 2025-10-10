"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FiArrowRight, FiDownload, FiSmartphone, FiStar } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function CTASection() {
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = ctaRef.current;
    if (!section) return;

    // Floating elements animation
    gsap.to(".cta-floating", {
      y: "random(-15, 15)",
      x: "random(-10, 10)",
      rotation: "random(-5, 5)",
      duration: 4,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.3,
    });

    // Text animation
    gsap.fromTo(
      ".cta-content",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Buttons animation
    gsap.fromTo(
      ".cta-button",
      { opacity: 0, scale: 0.8, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={ctaRef}
      className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white relative z-20 overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="cta-floating absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
          <div className="cta-floating absolute top-1/3 right-20 w-32 h-32 bg-yellow-300/30 rounded-full blur-xl"></div>
          <div className="cta-floating absolute bottom-10 left-1/3 w-24 h-24 bg-pink-300/30 rounded-full blur-xl"></div>
          <div className="cta-floating absolute top-20 left-1/2 w-16 h-16 bg-green-300/30 rounded-full blur-xl"></div>
          <div className="cta-floating absolute bottom-1/3 right-10 w-28 h-28 bg-blue-300/30 rounded-full blur-xl"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="cta-content">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Ready to Transform
                <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Your Service Experience?
                </span>
              </h2>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of satisfied customers who trust BlueCollar for
                all their service needs. Professional quality, competitive
                prices, instant booking.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <button className="cta-button group bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 flex items-center justify-center gap-2">
                Get Started Now
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="cta-button group border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 backdrop-blur-sm hover:bg-white/10 flex items-center justify-center gap-2">
                <FiDownload className="group-hover:bounce transition-transform" />
                Download App
              </button>
            </motion.div>

            {/* App Download Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <FiSmartphone className="text-2xl text-white" />
                <div>
                  <div className="text-sm text-blue-100">Download on the</div>
                  <div className="font-bold text-white">App Store</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/20">
                <FiSmartphone className="text-2xl text-white" />
                <div>
                  <div className="text-sm text-blue-100">Get it on</div>
                  <div className="font-bold text-white">Google Play</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Content */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Phone Mockup */}
              <div className="relative mx-auto w-80 h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-[3rem] shadow-2xl p-4">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-[2.5rem] overflow-hidden relative">
                  {/* Screen Content */}
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-xl"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-3 bg-white/30 rounded-full"></div>
                      <div className="h-3 bg-white/20 rounded-full w-3/4 mx-auto"></div>
                      <div className="h-3 bg-white/20 rounded-full w-1/2 mx-auto"></div>
                    </div>
                    <div className="mt-6 space-y-2">
                      <div className="h-12 bg-white/20 rounded-2xl"></div>
                      <div className="h-12 bg-white/15 rounded-2xl"></div>
                      <div className="h-12 bg-white/15 rounded-2xl"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements Around Phone */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg animate-bounce">
                <FiStar className="text-white text-xl" />
              </div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-green-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold">✓</span>
              </div>
              <div className="absolute top-1/2 -right-6 w-10 h-10 bg-pink-400 rounded-full flex items-center justify-center shadow-lg animate-ping">
                <span className="text-white text-sm">!</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-200 text-sm">Support Available</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">1M+</div>
              <div className="text-blue-200 text-sm">App Downloads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">99%</div>
              <div className="text-blue-200 text-sm">Uptime Guarantee</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">30s</div>
              <div className="text-blue-200 text-sm">Average Booking Time</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
