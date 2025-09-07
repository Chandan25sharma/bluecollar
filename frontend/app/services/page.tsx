"use client";

import { useState, useEffect } from "react";
import Header from "../../components/Header";
import {
  FiSearch,
  FiStar,
  FiClock,
  FiCheckCircle,
  FiUsers,
  FiArrowRight,
  FiFilter,
  FiX,
  FiGrid,
  FiMapPin,
  FiCalendar,
  FiHeart,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  duration: string;
  provider: string;
  providerRating: number;
  featured: boolean;
  popular: boolean;
  saved?: boolean;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Mock data with more details
    setServices([
      {
        id: "1",
        title: "Professional Electrical Wiring Installation",
        description:
          "Complete home electrical wiring solutions with safety certification and compliance with all local codes.",
        price: 120,
        rating: 4.8,
        reviews: 124,
        category: "electrical",
        duration: "2-4 hours",
        provider: "Elite Electricians",
        providerRating: 4.9,
        featured: true,
        popular: true,
        saved: false,
      },
      {
        id: "2",
        title: "Emergency Plumbing Repair Service",
        description:
          "24/7 available plumbing services for leaks, clogs, pipe repairs, and fixture installations.",
        price: 85,
        rating: 4.7,
        reviews: 98,
        category: "plumbing",
        duration: "1-3 hours",
        provider: "QuickFlow Plumbing",
        providerRating: 4.8,
        featured: false,
        popular: true,
        saved: true,
      },
      {
        id: "3",
        title: "Custom Furniture Carpentry Workshop",
        description:
          "Handcrafted furniture pieces tailored to your specifications using premium quality materials.",
        price: 200,
        rating: 4.9,
        reviews: 76,
        category: "carpentry",
        duration: "4-8 hours",
        provider: "Artisan Woodworks",
        providerRating: 4.9,
        featured: true,
        popular: false,
        saved: false,
      },
      {
        id: "4",
        title: "Expert Tailoring & Alteration Services",
        description:
          "Custom clothing alterations, repairs, and creations with premium fabrics and precision stitching.",
        price: 45,
        rating: 4.6,
        reviews: 203,
        category: "tailoring",
        duration: "1-2 hours",
        provider: "Precision Stitches",
        providerRating: 4.7,
        featured: false,
        popular: true,
        saved: false,
      },
      {
        id: "5",
        title: "HVAC System Installation & Maintenance",
        description:
          "Professional heating and cooling system installation, maintenance, and repair services.",
        price: 300,
        rating: 4.8,
        reviews: 87,
        category: "hvac",
        duration: "3-5 hours",
        provider: "Climate Control Experts",
        providerRating: 4.8,
        featured: true,
        popular: false,
        saved: false,
      },
      {
        id: "6",
        title: "Premium Home Painting Services",
        description:
          "Interior and exterior painting with color consultation, surface preparation, and clean finish.",
        price: 150,
        rating: 4.5,
        reviews: 112,
        category: "painting",
        duration: "4-6 hours",
        provider: "Color Masters",
        providerRating: 4.6,
        featured: false,
        popular: true,
        saved: false,
      },
      {
        id: "7",
        title: "Smart Home Automation Setup",
        description:
          "Professional installation and configuration of smart home devices and automation systems.",
        price: 250,
        rating: 4.9,
        reviews: 67,
        category: "electrical",
        duration: "3-4 hours",
        provider: "TechHome Solutions",
        providerRating: 4.9,
        featured: true,
        popular: true,
        saved: false,
      },
      {
        id: "8",
        title: "Bathroom Renovation & Remodeling",
        description:
          "Complete bathroom remodeling services including plumbing, tiling, and fixture installation.",
        price: 500,
        rating: 4.7,
        reviews: 89,
        category: "plumbing",
        duration: "6-8 hours",
        provider: "Renovation Pros",
        providerRating: 4.7,
        featured: false,
        popular: false,
        saved: false,
      },
    ]);

    // Handle scroll for navbar effect
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { id: "all", name: "All Services", icon: <FiGrid className="text-sm" /> },
    { id: "electrical", name: "Electrical", icon: "⚡" },
    { id: "plumbing", name: "Plumbing", icon: "🚰" },
    { id: "carpentry", name: "Carpentry", icon: "🛠️" },
    { id: "tailoring", name: "Tailoring", icon: "🧵" },
    { id: "hvac", name: "HVAC", icon: "❄️" },
    { id: "painting", name: "Painting", icon: "🎨" },
  ];

  const sortOptions = [
    { id: "popular", name: "Most Popular" },
    { id: "rating", name: "Highest Rated" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
  ];

  const toggleSaveService = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, saved: !service.saved } : service
      )
    );
  };

  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.provider.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;

      const matchesPrice =
        service.price >= priceRange[0] && service.price <= priceRange[1];

      const matchesRating = service.rating >= ratingFilter;

      return matchesSearch && matchesCategory && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
        default:
          if (a.popular && !b.popular) return -1;
          if (!a.popular && b.popular) return 1;
          return b.reviews - a.reviews;
      }
    });

  const renderStars = (rating: number, size = "sm") => {
    const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4";
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${starSize} ${
              star <= Math.floor(rating) ? "text-amber-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span
          className={`ml-1 ${
            size === "sm" ? "text-xs" : "text-sm"
          } text-gray-600`}
        >
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

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

            {/* Rating */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 text-xs uppercase mb-3">
                Minimum Rating
              </h4>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
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
                            setRatingFilter(0);
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

                    {/* Minimum Rating */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-700 text-sm mb-3 uppercase tracking-wider">
                        Minimum Rating
                      </h4>
                      <select
                        value={ratingFilter}
                        onChange={(e) =>
                          setRatingFilter(Number(e.target.value))
                        }
                        className="w-full border border-gray-300 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value={0}>All Ratings</option>
                        <option value={4}>4+ Stars</option>
                        <option value={4.5}>4.5+ Stars</option>
                      </select>
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
                  "Carpentry",
                  "Tailoring",
                  "HVAC",
                  "Painting",
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat.toLowerCase())}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                      selectedCategory === cat.toLowerCase()
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Services Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                {filteredServices
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
                          service.category === "electrical"
                            ? "from-blue-400 to-purple-500"
                            : service.category === "plumbing"
                            ? "from-blue-400 to-cyan-500"
                            : service.category === "carpentry"
                            ? "from-amber-400 to-orange-500"
                            : service.category === "tailoring"
                            ? "from-pink-400 to-rose-500"
                            : service.category === "hvac"
                            ? "from-cyan-400 to-blue-500"
                            : "from-green-400 to-teal-500"
                        }`}
                      >
                        <span className="text-4xl">
                          {service.category === "electrical" && "⚡"}
                          {service.category === "plumbing" && "🚰"}
                          {service.category === "carpentry" && "🛠️"}
                          {service.category === "tailoring" && "🧵"}
                          {service.category === "hvac" && "❄️"}
                          {service.category === "painting" && "🎨"}
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
                          <div className="flex items-center text-xs text-gray-500">
                            {renderStars(service.rating, "sm")}
                            <span className="ml-1">({service.reviews})</span>
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
                  ))}
              </motion.div>
            </div>

            {/* Load More (if applicable) */}
            {filteredServices.length > 0 && (
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
