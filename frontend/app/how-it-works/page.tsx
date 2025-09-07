"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiSearch, FiClock, FiCheckCircle, FiUsers, FiArrowLeft,  } from "react-icons/fi";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "1",
      title: "Search & Compare",
      desc: "Browse available services, check provider ratings, and compare prices.",
      icon: <FiSearch className="text-2xl text-white" />,
      bg: "from-teal-400 to-cyan-500",
    },
    {
      number: "2",
      title: "Book Instantly",
      desc: "Schedule a service at your preferred time with a simple booking system.",
      icon: <FiClock className="text-2xl text-white" />,
      bg: "from-orange-400 to-rose-500",
    },
    {
      number: "3",
      title: "Get It Done",
      desc: "Sit back and relax while our verified professional completes the job.",
      icon: <FiCheckCircle className="text-2xl text-white" />,
      bg: "from-indigo-400 to-purple-500",
    },
  ];

  const features = [
    {
      icon: <FiUsers className="text-cyan-600 text-3xl" />,
      title: "Verified Professionals",
      desc: "Every provider is background-checked and rated by users.",
    },
    {
      icon: <FiCheckCircle className="text-amber-500 text-3xl" />,
      title: "Guaranteed Satisfaction",
      desc: "High-quality services with customer satisfaction guaranteed.",
    },
    {
      icon: <FiClock className="text-indigo-500 text-3xl" />,
      title: "Instant Booking",
      desc: "Book your service at your convenience with instant confirmation.",
    },
  ];
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-teal-500 text-white py-20 px-6">
        {/* Back Button */}
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-white font-medium hover:text-yellow-300 transition"
          >
            <FiArrowLeft className="mr-2" /> Back
          </button>
        </div>
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            How <span className="text-amber-300">BlueCollar</span> Works
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
          >
            A simple 3-step process to connect you with trusted service providers.
          </motion.p>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100 hover:shadow-xl transition-transform transform hover:-translate-y-2"
          >
            <div
              className={`w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center bg-gradient-to-br ${step.bg}`}
            >
              {step.icon}
            </div>
            <h2 className="text-xl font-bold mb-3 text-gray-800">{step.title}</h2>
            <p className="text-gray-600 text-sm">{step.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Features / Benefits Section */}
      <section className="py-12 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-2"
          >
            Why Choose BlueCollar?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-sm md:text-base max-w-xl mx-auto"
          >
            Connect with verified local professionals, book instantly, and enjoy
            quality work with complete satisfaction.
          </motion.p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Ready to Book Your First Service?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mb-8 opacity-90 max-w-md mx-auto"
        >
          Join thousands of satisfied customers who trust BlueCollar daily.
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/services"
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all text-sm"
        >
          Explore Services
        </motion.a>
          </section>
          <Footer />
    </div>
  );
}
