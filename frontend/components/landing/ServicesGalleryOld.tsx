"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FiZoomIn } from "react-icons/fi";

interface GalleryImage {
  id: number;
  title: string;
  category: string;
  image: string;
  description: string;
}

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    title: "Modern Kitchen Renovation",
    category: "Plumbing",
    image: "/api/placeholder/400/300",
    description: "Complete kitchen plumbing installation",
  },
  {
    id: 2,
    title: "Home Electrical Upgrade",
    category: "Electrical",
    image: "/api/placeholder/400/300",
    description: "Smart home electrical system installation",
  },
  {
    id: 3,
    title: "Office Deep Cleaning",
    category: "Cleaning",
    image: "/api/placeholder/400/300",
    description: "Professional commercial cleaning service",
  },
  {
    id: 4,
    title: "Luxury Car Maintenance",
    category: "Auto Repair",
    image: "/api/placeholder/400/300",
    description: "Premium automotive service and repair",
  },
  {
    id: 5,
    title: "Interior Wall Painting",
    category: "Painting",
    image: "/api/placeholder/400/300",
    description: "Professional interior painting project",
  },
  {
    id: 6,
    title: "Home Security System",
    category: "Security",
    image: "/api/placeholder/400/300",
    description: "Advanced security camera installation",
  },
  {
    id: 7,
    title: "Wedding Photography",
    category: "Photography",
    image: "/api/placeholder/400/300",
    description: "Professional wedding photography session",
  },
  {
    id: 8,
    title: "Deck Repair & Build",
    category: "Handyman",
    image: "/api/placeholder/400/300",
    description: "Custom deck construction and repair",
  },
  {
    id: 9,
    title: "Bathroom Renovation",
    category: "Plumbing",
    image: "/api/placeholder/400/300",
    description: "Complete bathroom plumbing overhaul",
  },
];

const categories = [
  "All",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Auto Repair",
  "Painting",
  "Security",
  "Photography",
  "Handyman",
];

export default function ServicesGallery() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filteredImages =
    selectedCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Our Work{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            See the quality work delivered by our verified professionals
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-64 bg-gradient-to-br from-green-100 to-emerald-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-500 opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl text-green-600 opacity-50">📷</div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button
                    onClick={() => setSelectedImage(image)}
                    className="bg-white/20 backdrop-blur-sm border border-white/30 text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    <FiZoomIn className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-3">
                  {image.category}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {image.title}
                </h3>
                <p className="text-gray-600">{image.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Modal for full image view */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl overflow-hidden max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-80 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <div className="text-8xl text-green-600 opacity-50">📷</div>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-sm font-semibold rounded-full mb-3">
                  {selectedImage.category}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {selectedImage.description}
                </p>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            View Full Portfolio
          </button>
        </motion.div>
      </div>
    </section>
  );
}
