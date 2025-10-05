"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiGrid,
  FiSearch,
  FiStar,
  FiUser,
} from "react-icons/fi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { servicesAPI } from "../lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
}

export default function LandingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    // Fetch real services from API
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getServices();
      // Filter only active services
      const activeServices = response.data.filter((s: Service) => s.isActive);
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      // Set empty array on error
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Services", icon: <FiGrid className="text-sm" /> },
    { id: "Electrical", name: "Electrical", icon: "⚡" },
    { id: "Plumbing", name: "Plumbing", icon: "🚰" },
    { id: "Cleaning", name: "Cleaning", icon: "🧹" },
    { id: "Carpentry", name: "Carpentry", icon: "🛠️" },
    { id: "HVAC", name: "HVAC", icon: "❄️" },
    { id: "Painting", name: "Painting", icon: "🎨" },
  ];

  const filteredServices = services.filter(
    (s) =>
      (s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || s.category === selectedCategory)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />

      {/* Hero Section */}
      <header className="bg-gradient-to-br from-white to-green-50 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight"
            >
              Find Trusted Local{" "}
              <span className="text-green-600">Professionals</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-base md:text-lg mb-8 max-w-md"
            >
              Book skilled service providers for all your home needs. Quality
              guaranteed with our satisfaction promise.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/client-signup"
                className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all text-center"
              >
                Find Services
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/provider-signup"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all text-center"
              >
                Become a Provider
              </motion.a>
            </motion.div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                <div className="grid grid-cols-2 gap-4">
                  {["⚡", "🚰", "🛠️", "🧵"].map((icon, i) => (
                    <motion.div
                      whileHover={{ y: -5, scale: 1.05 }}
                      key={i}
                      className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-xl flex flex-col items-center justify-center shadow-sm"
                    >
                      <span className="text-3xl mb-2">{icon}</span>
                      <span className="text-xs font-medium text-gray-600">
                        {
                          ["Electrical", "Plumbing", "Carpentry", "Tailoring"][
                            i
                          ]
                        }
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-yellow-100 rounded-full blur-xl opacity-50 z-0"></div>
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full blur-xl opacity-50 z-0"></div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Rest of the content remains similar but with enhanced styling */}
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-8xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "500+", label: "Professionals" },
              { number: "2.5K+", label: "Completed Jobs" },
              { number: "98%", label: "Satisfaction" },
              { number: "24/7", label: "Support" },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="text-center p-4 bg-gray-50 rounded-xl"
              >
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-center mb-8 text-gray-800"
          >
            Find the Right Service
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8"
          >
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
            </div>

            <div className="flex overflow-x-auto space-x-3 pb-2">
              {categories.map((category) => (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl flex items-center whitespace-nowrap text-sm ${
                    selectedCategory === category.id
                      ? "bg-green-100 text-green-700 shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Services Grid */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-gray-800">
              Popular Services
            </h3>

            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <div className="text-gray-600 text-sm">Loading services...</div>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
                <div className="text-gray-400 mb-3 text-sm">
                  No services found
                </div>
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("all");
                  }}
                  className="text-green-600 hover:text-green-800 font-medium text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <motion.div
                    whileHover={{ y: -5 }}
                    key={service.id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-blue-50 h-40 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-4xl">
                        {
                          categories.find((c) => c.id === service.category)
                            ?.icon
                        }
                      </span>
                    </div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-gray-800 text-sm">
                        {service.title}
                      </h4>
                      <div className="font-bold text-green-600 text-sm">
                        ${service.price}
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs mb-4">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <span className="text-gray-600 text-xs font-medium">
                          {service.category}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-500 text-xs">
                        <FiClock className="mr-1 text-xs" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={`/service/${service.id}`}
                      className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white py-2.5 rounded-xl font-medium hover:shadow-md transition-all flex items-center justify-center text-xs"
                    >
                      View Details <FiArrowRight className="ml-1 text-xs" />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            How It Works
          </h2>
          <p className="text-gray-600 text-center text-sm max-w-md mx-auto mb-10">
            Getting help with your home services has never been easier
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: "1",
                title: "Search & Compare",
                desc: "Browse services, read reviews, and compare prices",
              },
              {
                number: "2",
                title: "Book Instantly",
                desc: "Schedule a service at your convenience",
              },
              {
                number: "3",
                title: "Get It Done",
                desc: "Enjoy quality service with our guarantee",
              },
            ].map((step, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-gradient-to-b from-white to-gray-50 p-6 rounded-2xl shadow-sm text-center border border-gray-100"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600 font-bold">
                  {step.number}
                </div>
                <h3 className="font-bold text-gray-800 text-sm mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
            Customer Reviews
          </h2>
          <p className="text-gray-600 text-center text-sm max-w-md mx-auto mb-10">
            Hear from our satisfied customers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                review:
                  "The electrician arrived on time and fixed our wiring issue in no time. Professional and affordable!",
              },
              {
                name: "Michael Torres",
                review:
                  "Found a great plumber through SkillServe who fixed our leak at a reasonable price. Will definitely use again.",
              },
              {
                name: "Emma Williams",
                review:
                  "The tailor I found here did an amazing job with my wedding dress alterations. Perfect fit!",
              },
            ].map((testimonial, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-blue-100 rounded-full mr-3 flex items-center justify-center">
                    <FiUser className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{testimonial.name}</h4>
                    <div className="flex items-center text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className="text-xs fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-xs">"{testimonial.review}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-green-600 to-teal-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-sm mb-8 opacity-90 max-w-md mx-auto">
            Join thousands of satisfied customers who found the perfect service
            professional
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/client-signup"
              className="bg-white text-green-600 px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all text-sm"
            >
              Find a Provider
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/providers"
              className="border border-white text-white px-6 py-3 rounded-xl font-medium hover:bg-white hover:text-green-600 transition-all text-sm"
            >
              Become a Provider
            </motion.a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
