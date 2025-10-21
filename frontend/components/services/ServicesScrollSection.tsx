"use client";

import { motion } from "framer-motion";
import { FiArrowRight, FiCheckCircle, FiClock, FiStar } from "react-icons/fi";
import ScrollStack, { ScrollStackItem } from "./ScrollStack";

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

interface ServicesScrollSectionProps {
  services: Service[];
  loading: boolean;
  selectedCategory: string;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
}

export default function ServicesScrollSection({
  services,
  loading,
  selectedCategory,
  categories,
}: ServicesScrollSectionProps) {
  if (loading) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading premium services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (services.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-gray-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Services Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          <p className="text-sm text-gray-500 mt-2">
            Scroll down to explore our services with a unique stacking effect
          </p>
        </motion.div>

        <div className="relative">
          <ScrollStack
            useWindowScroll={true}
            itemDistance={200}
            itemScale={0.05}
            itemStackDistance={50}
            stackPosition="15%"
            scaleEndPosition="10%"
            baseScale={0.85}
            rotationAmount={1.5}
            blurAmount={0.3}
          >
            {services.map((service, index) => (
              <ScrollStackItem
                key={service.id}
                itemClassName="service-scroll-card"
              >
                <div className="group bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex">
                  <div
                    className={`w-1/3 bg-gradient-to-br ${
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
                    } flex items-center justify-center relative`}
                  >
                    <span className="text-8xl">
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

                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-green-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {service.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="text-4xl font-bold text-green-600">
                          ${service.price}
                        </div>
                        <div className="flex items-center gap-6 text-gray-500">
                          <div className="flex items-center gap-2">
                            <FiClock className="w-5 h-5" />
                            <span className="text-lg">{service.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FiStar className="w-5 h-5 text-yellow-500" />
                            <span className="text-lg">4.8</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={`/service/${service.id}`}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 text-center flex items-center justify-center gap-2 text-lg"
                        >
                          View Details
                          <FiArrowRight className="w-6 h-6" />
                        </motion.a>
                        <button className="p-4 border-2 border-gray-200 hover:border-green-500 rounded-2xl transition-colors">
                          <FiCheckCircle className="w-7 h-7 text-gray-400 hover:text-green-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
