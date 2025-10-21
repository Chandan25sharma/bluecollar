"use client";

import { motion } from "framer-motion";
import { FiFilter, FiGrid, FiList, FiSearch } from "react-icons/fi";

interface SearchSectionProps {
  search: string;
  setSearch: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  viewMode?: 'grid' | 'list';
  setViewMode?: (mode: 'grid' | 'list') => void;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    count: number;
  }>;
}

export default function ServicesSearchSection({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  viewMode = 'grid',
  setViewMode,
  categories
}: SearchSectionProps) {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Service
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Search through our curated collection of professional services
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto mb-8"
        >
          <div className="relative group">
            <FiSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl group-focus-within:text-green-500 transition-colors" />
            <input
              type="text"
              placeholder="Search for services, categories, or providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-16 pr-32 py-6 rounded-2xl bg-gray-50 border-2 border-transparent focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 text-gray-800 text-lg placeholder-gray-500 transition-all duration-300"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {setViewMode && (
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-xl transition-colors"
                >
                  {viewMode === "grid" ? <FiList /> : <FiGrid />}
                </button>
              )}
              <button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105">
                <FiFilter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all duration-300 ${
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg border border-gray-100"
              }`}
            >
              <span className="text-2xl">{category.icon}</span>
              <div className="text-left">
                <div className="font-semibold">{category.name}</div>
                <div className="text-sm opacity-75">
                  {category.count} services
                </div>
              </div>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
