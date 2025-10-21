"use client";

import { motion } from "framer-motion";
import DomeGallery from "./DomeGallery";

// Service images with provider information
const servicesData = [
  {
    src: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop",
    alt: "Kitchen Plumbing Installation",
    provider: "Mike Johnson",
  },
  {
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop",
    alt: "Professional Electrical Work",
    provider: "Sarah Chen",
  },
  {
    src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop",
    alt: "Deep House Cleaning",
    provider: "Maria Garcia",
  },
  {
    src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
    alt: "Building Construction",
    provider: "David Wilson",
  },
  {
    src: "https://images.unsplash.com/photo-1605371924599-2d0365da1ae0?q=80&w=800&auto=format&fit=crop",
    alt: "Interior Painting Service",
    provider: "Lisa Anderson",
  },
  {
    src: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop",
    alt: "Garden Landscaping",
    provider: "Tom Rodriguez",
  },
  {
    src: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?q=80&w=800&auto=format&fit=crop",
    alt: "HVAC System Maintenance",
    provider: "Robert Kim",
  },
  {
    src: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=800&auto=format&fit=crop",
    alt: "Professional Roofing",
    provider: "James Miller",
  },
  {
    src: "https://images.unsplash.com/photo-1581578017426-96749d0d5f9c?q=80&w=800&auto=format&fit=crop",
    alt: "Bathroom Renovation",
    provider: "Emma Thompson",
  },
  {
    src: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop",
    alt: "Appliance Repair Service",
    provider: "Alex Davis",
  },
  {
    src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=800&auto=format&fit=crop",
    alt: "Professional Tile Work",
    provider: "Carlos Ruiz",
  },
  {
    src: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=800&auto=format&fit=crop",
    alt: "Office Cleaning Service",
    provider: "Jennifer Lee",
  },
];

export default function ServicesGallery() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
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
            Explore stunning work completed by our verified professionals. Drag
            to rotate and click to view details.
          </p>
        </motion.div>

        {/* Interactive 3D Dome Gallery */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative h-[600px] md:h-[700px] lg:h-[800px] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 shadow-2xl"
          style={{
            background:
              "linear-gradient(135deg, #064e3b 0%, #047857 25%, #059669 50%, #10b981 75%, #34d399 100%)",
          }}
        >
          <DomeGallery
            services={servicesData}
            fit={0.6}
            overlayBlurColor="#064e3b"
            imageBorderRadius="16px"
            openedImageBorderRadius="20px"
            openedImageWidth="400px"
            openedImageHeight="500px"
            grayscale={false}
          />
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-6 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-green-200">
            <div className="text-sm text-gray-600">
              <span className="font-semibold text-green-600">💡 Tip:</span> Drag
              to rotate • Click to enlarge • ESC to close
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            Book a Service Today
          </button>
        </motion.div>
      </div>
    </section>
  );
}
