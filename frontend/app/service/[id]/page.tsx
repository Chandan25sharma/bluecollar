"use client";

import { motion } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiUser,
  FiTag,
  FiAward,
  FiTrendingUp,
} from "react-icons/fi";

export default function ServiceDetail({ params }: { params: { id: string } }) {
  // Mock data for now; later fetch from API
  const service = {
    id: params.id,
    title: "Professional Electrical Wiring",
    category: "Electrical",
    description:
      "Complete home electrical wiring solutions with safety certification. Our certified electricians ensure top-notch quality and safety.",
    price: 120,
    rating: 4.8,
    reviews: 124,
    duration: "2-3 hours",
    provider: "John Doe",
    providerRating: 4.9,
    availability: "Today",
    featured: true,
    popular: true,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-teal-500 text-white py-20 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-3 max-w-3xl"
        >
          {service.title}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center space-x-3"
        >
          <span className="flex items-center bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
            <FiAward className="mr-1" /> Featured
          </span>
          <span className="flex items-center bg-white/20 text-white text-xs font-medium px-2 py-1 rounded-full">
            <FiTag className="mr-1" /> {service.category}
          </span>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 -mt-16 relative z-10">
        <div className="bg-white shadow-lg rounded-2xl overflow-hidden md:flex">
          {/* Left: Image */}
          <div className="md:w-1/2 bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 p-20">[ Service Image ]</span>
          </div>

          {/* Right: Details */}
          <div className="md:w-1/2 p-8 flex flex-col justify-between">
            {/* Title & Rating */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {service.title}
              </h2>

              <div className="flex items-center mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`mr-1 ${
                      i < Math.floor(service.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="ml-2 text-gray-600">
                  {service.rating} ({service.reviews} reviews)
                </span>
              </div>

              <p className="text-gray-600 mb-6">{service.description}</p>
            </div>

            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-md border rounded-xl shadow p-5"
            >
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Price:</span>
                <span className="font-bold text-green-600">
                  ${service.price}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="text-gray-600">{service.duration}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-medium text-gray-700">Provider:</span>
                <span className="text-gray-600">{service.provider}</span>
              </div>
              <div className="flex justify-between mb-4">
                <span className="font-medium text-gray-700">Availability:</span>
                <span className="text-green-600">{service.availability}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
                Book Now
              </button>
            </motion.div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 bg-white rounded-xl shadow p-6">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">
            More About This Service
          </h3>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Details */}
            <div>
              <h4 className="font-semibold flex items-center mb-2">
                <FiClock className="mr-2 text-green-600" /> Service Details
              </h4>
              <p className="text-gray-600 text-sm">
                Our certified professionals ensure high-quality wiring services
                that comply with all safety regulations. Ideal for new homes or
                renovation projects.
              </p>
            </div>

            {/* Provider */}
            <div>
              <h4 className="font-semibold flex items-center mb-2">
                <FiUser className="mr-2 text-green-600" /> Provider Info
              </h4>
              <p className="text-gray-600 text-sm">
                {service.provider} has a rating of {service.providerRating}⭐ and
                has successfully completed 200+ electrical service requests.
              </p>
            </div>

            {/* Highlights */}
            <div>
              <h4 className="font-semibold flex items-center mb-2">
                <FiTrendingUp className="mr-2 text-green-600" /> Why Choose Us
              </h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>✔ Certified & experienced professionals</li>
                <li>✔ Safety & compliance guaranteed</li>
                <li>✔ 24/7 emergency availability</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
