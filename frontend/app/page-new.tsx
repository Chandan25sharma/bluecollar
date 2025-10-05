"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiShield,
  FiStar,
  FiTool,
  FiUsers,
  FiZap,
} from "react-icons/fi";
import { profileAPI, servicesAPI } from "../lib/api";
import { authUtils } from "../lib/auth";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
  provider: {
    id: string;
    name: string;
    rate: number;
    verified: boolean;
  };
}

interface Provider {
  id: string;
  name: string;
  skills: string[];
  rate: number;
  verified: boolean;
}

export default function HomePage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const authenticated = authUtils.isAuthenticated();
    setIsAuthenticated(authenticated);

    if (authenticated) {
      const user = authUtils.getUser();
      setUserRole(user?.role || null);
    }

    // Fetch services and providers
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(false);
    try {
      // Fetch services
      const servicesRes = await servicesAPI.getServices();
      setServices(servicesRes.data);

      // Fetch providers
      const providersRes = await profileAPI.getAllProviders();
      setProviders(providersRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Services", icon: <FiTool /> },
    { id: "Plumbing", name: "Plumbing", icon: "🔧" },
    { id: "Electrical", name: "Electrical", icon: "⚡" },
    { id: "Cleaning", name: "Cleaning", icon: "🧹" },
    { id: "Carpentry", name: "Carpentry", icon: "🔨" },
    { id: "Painting", name: "Painting", icon: "🎨" },
    { id: "Gardening", name: "Gardening", icon: "🌱" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory && service.isActive;
  });

  const handleServiceClick = (serviceId: string) => {
    if (isAuthenticated && userRole === "CLIENT") {
      router.push(`/service/${serviceId}`);
    } else if (!isAuthenticated) {
      router.push("/login");
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (userRole === "CLIENT") {
        router.push("/dashboard/client");
      } else if (userRole === "PROVIDER") {
        router.push("/dashboard/provider");
      }
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FiTool className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                BlueCollar
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Services
              </Link>
              <Link
                href="/how-it-works"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="/about-us"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <Link
                    href={
                      userRole === "CLIENT"
                        ? "/dashboard/client"
                        : "/dashboard/provider"
                    }
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => authUtils.logout()}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Find Skilled{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professionals
              </span>
              <br />
              For Your Home Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            >
              Connect with verified local professionals for plumbing,
              electrical, cleaning, and more. Get your job done right, on time,
              every time.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for services (plumbing, electrical, cleaning...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-lg shadow-lg"
                />
              </div>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <FiUsers className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {providers.length}+
                </div>
                <div className="text-sm text-gray-600">Verified Providers</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <FiTool className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">
                  {services.length}+
                </div>
                <div className="text-sm text-gray-600">Services Available</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <FiStar className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">4.9</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <FiCheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">100%</div>
                <div className="text-sm text-gray-600">Satisfaction</div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Browse by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-105"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">
                  {typeof category.icon === "string" ? (
                    category.icon
                  ) : (
                    <FiTool />
                  )}
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {selectedCategory === "all"
                ? "Featured Services"
                : `${selectedCategory} Services`}
            </h2>
            <Link
              href="/services"
              className="text-blue-600 hover:text-blue-700 flex items-center"
            >
              View All <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No services found. Try a different search or category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.slice(0, 6).map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-shadow hover:shadow-xl"
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                          {service.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="ml-1 text-sm font-medium">4.8</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="w-4 h-4 mr-1" />
                        {service.duration}
                      </div>
                      {service.provider?.verified && (
                        <div className="flex items-center text-green-600 text-sm">
                          <FiCheckCircle className="w-4 h-4 mr-1" />
                          Verified
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          ${service.price}
                        </div>
                        <div className="text-xs text-gray-500">Per service</div>
                      </div>
                      <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose BlueCollar?</h2>
            <p className="text-blue-100 text-lg">
              Your trusted platform for quality home services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiShield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
              <p className="text-blue-100">
                All service providers are thoroughly verified and
                background-checked
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiZap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quick & Easy Booking</h3>
              <p className="text-blue-100">
                Book services in minutes with our simple and intuitive platform
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FiAward className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Guaranteed</h3>
              <p className="text-blue-100">
                100% satisfaction guarantee on all services or your money back
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Providers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Top Rated Providers
            </h2>
            <p className="text-gray-600">
              Meet our highly skilled and verified professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providers.slice(0, 3).map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {provider.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {provider.name}
                </h3>
                {provider.verified && (
                  <div className="flex items-center justify-center text-green-600 text-sm mb-3">
                    <FiCheckCircle className="w-4 h-4 mr-1" />
                    Verified Provider
                  </div>
                )}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {provider.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <FiStar className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="ml-2 text-lg font-bold">4.9</span>
                  <span className="ml-1 text-gray-600">(50+ reviews)</span>
                </div>
                <div className="mt-4 text-2xl font-bold text-gray-900">
                  ${provider.rate}/hr
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who trust BlueCollar for their
            home service needs
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-2xl transition-all text-lg"
            >
              Get Started Now
            </button>
            <Link
              href="/how-it-works"
              className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all text-lg"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FiTool className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">BlueCollar</span>
              </div>
              <p className="text-gray-400">
                Your trusted platform for quality home services
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/services" className="hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="hover:text-white">
                    How it Works
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="hover:text-white">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">For Providers</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/provider-signup" className="hover:text-white">
                    Become a Provider
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Provider Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">For Clients</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/client-signup" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-white">
                    Client Login
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 BlueCollar. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
