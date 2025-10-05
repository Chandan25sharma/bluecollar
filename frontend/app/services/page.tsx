"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiGrid,
  FiSearch,
} from "react-icons/fi";
import Header from "../../components/Header";
import { servicesAPI } from "../../lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
  provider?: {
    id: string;
    businessName: string;
  };
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetchServices();

    // Handle scroll for navbar effect
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      // Filter only active services
      const activeServices = response.data.filter((s: Service) => s.isActive);
      setServices(activeServices);
    } catch (error) {
      console.error("Failed to fetch services:", error);
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

  const sortOptions = [
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "title", name: "Alphabetical" },
  ];

  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;

      const matchesPrice =
        service.price >= priceRange[0] && service.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-white to-green-50 py-0 px-4 relative">
        <div className="max-w-8xl mx-auto text-center relative">
          {/* Back Button */}
          <div className="absolute left-1 top-0 md:top-3 md:left-3 text-left z-20">
            <button
              onClick={() => window.history.back()}
              className="flex items-center text-gray-600 hover:text-green-600 font-medium space-x-1 bg-white/70 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm"
            >
              <FiArrowRight className="transform rotate-180" />
              <span className="text-sm">Back</span>
            </button>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 pt-8"
            // 👆 extra padding-top to ensure no overlap
          >
            Find Professional <span className="text-green-600">Services</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-base md:text-lg mb-8 max-w-2xl mx-auto"
          >
            Discover trusted professionals for all your home service needs.
            Quality guaranteed, satisfaction ensured.
          </motion.p>

          {/* Search Bar → Mobile only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative max-w-2xl mx-auto lg:hidden"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400 text-sm" />
            </div>
            <input
              type="text"
              placeholder="Search services, providers, or categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-200 text-sm"
            />
          </motion.div>
        </div>
      </div>

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-8xl mx-auto px-4 py-8 lg:flex lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 h-[calc(100vh-96px)] overflow-y-auto p-4 bg-white rounded-2xl shadow-md">
            {/* Category Filters */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 text-xs uppercase mb-3">
                Categories
              </h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category.id
                        ? "bg-green-100 text-green-700"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 text-xs uppercase mb-3">
                Price Range
              </h4>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-green-600"
              />
            </div>

            {/* Sort By */}
            <div>
              <h4 className="font-semibold text-gray-700 text-xs uppercase mb-3">
                Sort By
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search Bar → Desktop only */}
            <div className="hidden lg:block mb-6">
              <div className="relative max-w-2xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search services, providers, or categories..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 border border-gray-200 text-sm"
                />
              </div>
            </div>

            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between bg-white px-4 py-3 rounded-xl shadow-sm"
              >
                <span className="font-medium text-sm">Filters</span>
                {showFilters ? <FiChevronUp /> : <FiChevronDown />}
              </button>
            </div>

            {/* Mobile Filters - */}
            <AnimatePresence>
              {showFilters && (
                <>
                  {/* Overlay */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black z-40"
                    onClick={() => setShowFilters(false)}
                  />

                  {/* Bottom Sheet */}
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 200, damping: 30 }}
                    className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 p-6 max-h-[85vh] overflow-y-auto"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-gray-900 tracking-wide">
                        Filter Services
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            // Reset all filters
                            setSelectedCategory("all");
                            setPriceRange([0, 1000]);
                            setSortBy(sortOptions[0]?.id || "");
                          }}
                          className="px-3 py-1 border border-green-600 text-green-600 rounded-xl text-sm font-medium hover:bg-green-50 transition"
                        >
                          Clear Filters
                        </button>
                        <button
                          onClick={() => setShowFilters(false)}
                          className="text-gray-400 hover:text-gray-600 transition text-2xl"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Categories - Horizontal Scroll */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                        Categories
                      </h4>
                      <div className="flex overflow-x-auto gap-2 pb-2">
                        {categories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`flex-shrink-0 flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                              selectedCategory === category.id
                                ? "bg-green-50 text-green-700 ring-1 ring-green-300"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {category.icon} {category.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                        Price Range
                      </h4>
                      <div className="flex justify-between text-xs text-gray-500 mb-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) =>
                          setPriceRange([0, Number(e.target.value)])
                        }
                        className="w-full h-2 bg-gray-200 rounded-lg accent-green-600 cursor-pointer"
                      />
                    </div>

                    <hr className="my-4 border-gray-200" />

                    {/* Sort By */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                        Sort By
                      </h4>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        {sortOptions.map((option) => (
                          <option key={option.id} value={option.id}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* CTA */}
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-bold text-lg transition-shadow shadow-md hover:shadow-lg">
                      Apply Filters
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                {filteredServices.length} Services Available
              </h2>
              <span className="text-sm text-gray-500">
                {selectedCategory !== "all" &&
                  `in ${
                    categories.find((c) => c.id === selectedCategory)?.name
                  }`}
              </span>
            </div>

            <div className="max-w-6xl mx-auto py-8">
              {/* Category Tabs */}
              <div className="flex space-x-4 mb-6 overflow-x-auto">
                {[
                  "All",
                  "Electrical",
                  "Plumbing",
                  "Cleaning",
                  "Carpentry",
                  "HVAC",
                  "Painting",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() =>
                      setSelectedCategory(cat === "All" ? "all" : cat)
                    }
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                      selectedCategory === (cat === "All" ? "all" : cat)
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                  <p className="mt-4 text-gray-600">Loading services...</p>
                </div>
              ) : (
                <>
                  {/* Services Grid */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4"
                  >
                    {filteredServices.length === 0 ? (
                      <div className="col-span-4 text-center py-12">
                        <p className="text-gray-600">
                          No services found matching your criteria.
                        </p>
                      </div>
                    ) : (
                      filteredServices
                        .filter(
                          (s) =>
                            selectedCategory === "all" ||
                            s.category === selectedCategory
                        )
                        .map((service) => (
                          <motion.div
                            whileHover={{ y: -5 }}
                            key={service.id}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all"
                          >
                            {/* Service Image/Header */}
                            <div
                              className={`h-40 flex items-center justify-center text-white bg-gradient-to-br ${
                                service.category === "Electrical"
                                  ? "from-blue-400 to-purple-500"
                                  : service.category === "Plumbing"
                                  ? "from-blue-400 to-cyan-500"
                                  : service.category === "Cleaning"
                                  ? "from-green-400 to-teal-500"
                                  : service.category === "Carpentry"
                                  ? "from-amber-400 to-orange-500"
                                  : service.category === "HVAC"
                                  ? "from-cyan-400 to-blue-500"
                                  : "from-purple-400 to-pink-500"
                              }`}
                            >
                              <span className="text-4xl">
                                {service.category === "Electrical" && "⚡"}
                                {service.category === "Plumbing" && "🚰"}
                                {service.category === "Cleaning" && "🧹"}
                                {service.category === "Carpentry" && "🛠️"}
                                {service.category === "HVAC" && "❄️"}
                                {service.category === "Painting" && "🎨"}
                              </span>
                            </div>

                            {/* Service Content */}
                            <div className="p-5">
                              <h3 className="font-bold text-gray-800 text-sm mb-2 line-clamp-2">
                                {service.title}
                              </h3>
                              <p className="text-gray-600 text-xs mb-4 line-clamp-2">
                                {service.description}
                              </p>

                              <div className="flex justify-between items-center mb-4">
                                <div className="text-lg font-bold text-green-600">
                                  ${service.price}
                                </div>
                                <div className="flex flex-col items-end text-xs text-gray-500">
                                  <span className="font-medium text-gray-700">
                                    {service.category}
                                  </span>
                                  <span className="flex items-center mt-1">
                                    <FiClock className="mr-1" />{" "}
                                    {service.duration}
                                  </span>
                                </div>
                              </div>

                              <motion.a
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                href={`/service/${service.id}`}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white py-2.5 rounded-xl font-medium hover:shadow-md flex items-center justify-center text-xs"
                              >
                                View Details
                              </motion.a>
                            </div>
                          </motion.div>
                        ))
                    )}
                  </motion.div>
                </>
              )}
            </div>

            {/* Load More (if applicable) */}
            {filteredServices.length > 0 && !loading && (
              <div className="mt-10 text-center">
                <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                  Load More Services
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
