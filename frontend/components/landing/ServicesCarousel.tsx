"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiCamera,
  FiDroplet,
  FiHome,
  FiSettings,
  FiShield,
  FiTool,
  FiZap,
} from "react-icons/fi";

interface Service {
  id: number;
  name: string;
  icon: any;
  description: string;
  providers: number;
  rating: number;
  image: string;
}

const services: Service[] = [
  {
    id: 1,
    name: "Plumbing",
    icon: FiDroplet,
    description: "Expert plumbing services for your home",
    providers: 45,
    rating: 4.8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 2,
    name: "Electrical",
    icon: FiZap,
    description: "Safe and reliable electrical work",
    providers: 38,
    rating: 4.9,
    image: "/api/placeholder/300/200",
  },
  {
    id: 3,
    name: "Cleaning",
    icon: FiHome,
    description: "Professional cleaning services",
    providers: 62,
    rating: 4.7,
    image: "/api/placeholder/300/200",
  },
  {
    id: 4,
    name: "Auto Repair",
    icon: FiSettings,
    description: "Complete automotive services",
    providers: 29,
    rating: 4.8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 5,
    name: "Painting",
    icon: FiTool,
    description: "Interior and exterior painting",
    providers: 33,
    rating: 4.6,
    image: "/api/placeholder/300/200",
  },
  {
    id: 6,
    name: "Security",
    icon: FiShield,
    description: "Home security installations",
    providers: 18,
    rating: 4.9,
    image: "/api/placeholder/300/200",
  },
  {
    id: 7,
    name: "Photography",
    icon: FiCamera,
    description: "Professional photography services",
    providers: 25,
    rating: 4.8,
    image: "/api/placeholder/300/200",
  },
  {
    id: 8,
    name: "Handyman",
    icon: FiTool,
    description: "General maintenance and repairs",
    providers: 41,
    rating: 4.7,
    image: "/api/placeholder/300/200",
  },
];

export default function ServicesCarousel() {
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || isPaused) return;

    const scrollWidth = scrollElement.scrollWidth;
    const clientWidth = scrollElement.clientWidth;
    let scrollLeft = 0;

    const scroll = () => {
      if (scrollLeft >= scrollWidth - clientWidth) {
        scrollLeft = 0;
      } else {
        scrollLeft += 1;
      }
      scrollElement.scrollLeft = scrollLeft;
    };

    const interval = setInterval(scroll, 30);

    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Popular{" "}
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Services
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most requested services from our verified professionals
          </p>
        </motion.div>

        <div
          ref={scrollRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-6 w-max">
            {/* Duplicate services for infinite scroll effect */}
            {[...services, ...services].map((service, index) => {
              const IconComponent = service.icon;
              return (
                <motion.div
                  key={`${service.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <IconComponent className="w-16 h-16 text-white" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-green-600 font-semibold">
                          {service.providers}
                        </span>
                        <span className="text-gray-500">providers</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-gray-700 font-semibold">
                          {service.rating}
                        </span>
                      </div>
                    </div>

                    <button className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform group-hover:scale-105">
                      Book Service
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
            View All Services
          </button>
        </motion.div>
      </div>
    </section>
  );
}
