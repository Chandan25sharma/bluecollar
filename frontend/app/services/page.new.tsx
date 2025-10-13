"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiClock, FiFilter, FiGrid, FiSearch, FiUser } from "react-icons/fi";
import ClientHeader from "../../components/ClientHeader";
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
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState("");

  const categories = [
    { id: "all", name: "All Services", count: 0 },
    { id: "plumbing", name: "Plumbing", count: 0 },
    { id: "electrical", name: "Electrical", count: 0 },
    { id: "cleaning", name: "Cleaning", count: 0 },
    { id: "landscaping", name: "Landscaping", count: 0 },
    { id: "painting", name: "Painting", count: 0 },
    { id: "carpentry", name: "Carpentry", count: 0 },
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await servicesAPI.getServices();
      setServices(response.data);
    } catch (err: any) {
      console.error("Error fetching services:", err);
      setError(err.response?.data?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      search === "" ||
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      service.category.toLowerCase() === selectedCategory;

    return service.isActive && matchesSearch && matchesCategory;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "name":
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return (
      <>
        <ClientHeader />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-0">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Find Professional <span className="text-blue-200">Services</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-blue-100 text-base md:text-lg mb-8 max-w-2xl mx-auto"
            >
              Discover trusted professionals for all your home service needs.
              Quality guaranteed, satisfaction ensured.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto relative"
            >
              <div className="relative">
                <FiSearch
                  className="absolute left-4 top-4 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-0 shadow-lg text-gray-900 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters and Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4 overflow-x-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <FiFilter className="mr-2" size={16} />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedServices.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <FiGrid className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No services found
                </h3>
                <p className="text-gray-500">
                  {search
                    ? "Try adjusting your search or filters"
                    : "No services available in this category"}
                </p>
              </div>
            ) : (
              sortedServices.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                          {service.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {service.category}
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <FiClock className="mr-1" size={14} />
                        {service.duration}
                      </div>
                    </div>

                    {service.provider && (
                      <div className="flex items-center text-sm text-gray-600 mb-4">
                        <FiUser className="mr-2" size={16} />
                        <span>{service.provider.businessName}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-blue-600">
                        ${service.price}
                      </div>
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        Book Now
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Results Summary */}
          {sortedServices.length > 0 && (
            <div className="mt-8 text-center text-gray-600">
              <p>
                Showing {sortedServices.length} of{" "}
                {services.filter((s) => s.isActive).length} services
                {selectedCategory !== "all" &&
                  ` in ${
                    categories.find((c) => c.id === selectedCategory)?.name
                  }`}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
