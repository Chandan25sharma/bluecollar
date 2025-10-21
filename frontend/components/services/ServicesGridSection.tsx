"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";

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

interface ServicesGridProps {
  services: Service[];
  loading: boolean;
  viewMode: "grid" | "list";
  selectedCategory: string;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
}

export default function ServicesGridSection({
  services,
  loading,
  viewMode,
  selectedCategory,
  categories,
}: ServicesGridProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {services.length} professional services available
            {selectedCategory !== "all" &&
              ` in ${categories.find((c) => c.id === selectedCategory)?.name}`}
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading premium services...</p>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-4xl mx-auto"
            }`}
          >
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  No Services Found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              services.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                    viewMode === "list" ? "flex items-center p-6" : ""
                  }`}
                >
                  <div
                    className={`relative ${
                      viewMode === "list"
                        ? "w-32 h-32 flex-shrink-0 mr-6"
                        : "h-64"
                    } bg-gradient-to-br ${
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
                    } flex items-center justify-center ${
                      viewMode === "list" ? "rounded-2xl" : ""
                    }`}
                  >
                    <span className="text-6xl">
                      {service.category === "Electrical" && "⚡"}
                      {service.category === "Plumbing" && "🚰"}
                      {service.category === "Cleaning" && "🧹"}
                      {service.category === "Carpentry" && "🛠️"}
                      {service.category === "HVAC" && "❄️"}
                      {service.category === "Painting" && "🎨"}
                    </span>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm font-semibold">
                      {service.category}
                    </div>
                  </div>

                  <div className={viewMode === "list" ? "flex-1" : "p-8"}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-3xl font-bold text-green-600">
                        ${service.price}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiClock className="w-4 h-4" />
                          {service.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          4.8
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        href={`/service/${service.id}`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 text-center flex items-center justify-center gap-2"
                      >
                        View Details
                        <FiArrowRight className="w-5 h-5" />
                      </motion.a>
                      <button className="p-4 border-2 border-gray-200 hover:border-green-500 rounded-2xl transition-colors">
                        <FiCheckCircle className="w-6 h-6 text-gray-400 hover:text-green-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
