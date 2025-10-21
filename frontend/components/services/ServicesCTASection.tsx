"use client";

import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

export default function ServicesCTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found their perfect
            service provider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-900 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:shadow-lg flex items-center gap-2"
            >
              Book a Service
              <FiArrowRight />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:bg-white/10"
            >
              Become a Provider
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
