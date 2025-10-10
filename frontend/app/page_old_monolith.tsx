"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiGrid,
  FiSearch,
  FiStar,
  FiUser,
  FiShield,
  FiZap,
  FiHeart,
} from "react-icons/fi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollSmootherComponent, { hasPinContent, hasFadeAnim } from "../components/ScrollSmoother";
import { servicesAPI } from "../lib/api";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
}

export default function LandingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Refs for pinned sections
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);
  const howItWorksRef = useRef<HTMLElement>(null);
  const testimonialsRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetchServices();
  }, []);

  // GSAP Animations
  useEffect(() => {
    // Pin sections for scroll effect
    if (statsRef.current) hasPinContent(statsRef.current);
    if (featuresRef.current) hasPinContent(featuresRef.current);
    if (servicesRef.current) hasPinContent(servicesRef.current);
    if (howItWorksRef.current) hasPinContent(howItWorksRef.current);
    if (testimonialsRef.current) hasPinContent(testimonialsRef.current);

    // Fade animations
    hasFadeAnim();

    // Hero parallax effect
    gsap.to(".hero-bg", {
      yPercent: -50,
      ease: "none",
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    // Floating elements animation
    gsap.to(".float-element", {
      y: -20,
      rotation: 5,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      stagger: 0.5,
    });

  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await servicesAPI.getServices();
      const activeServices = response.data.filter((s: Service) => s.isActive);
      setServices(activeServices);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
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

  const filteredServices = services.filter(
    (s) =>
      (s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.category.toLowerCase().includes(search.toLowerCase())) &&
      (selectedCategory === "all" || s.category === selectedCategory)
  );

  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">
        <ScrollSmootherComponent />
        <Header />

        {/* Hero Section with Parallax */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center overflow-hidden"
        >
          {/* Animated Background */}
          <div className="hero-bg absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 opacity-10"></div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="float-element absolute top-20 left-10 w-20 h-20 bg-yellow-200 rounded-full opacity-20 blur-xl"></div>
            <div className="float-element absolute top-40 right-20 w-32 h-32 bg-pink-200 rounded-full opacity-20 blur-xl"></div>
            <div className="float-element absolute bottom-40 left-1/4 w-24 h-24 bg-green-200 rounded-full opacity-20 blur-xl"></div>
            <div className="float-element absolute bottom-20 right-1/3 w-28 h-28 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-12 lg:mb-0">
                <div data-fade-anim>
                  <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                    Find Trusted{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                      Local Professionals
                    </span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 max-w-lg">
                    Book skilled service providers for all your home needs. Quality
                    guaranteed with our satisfaction promise.
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <motion.a
                      whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
                      whileTap={{ scale: 0.95 }}
                      href="/client-signup"
                      className="bg-gradient-to-r from-blue-600 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all text-center"
                    >
                      Find Services
                    </motion.a>
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href="/provider-signup"
                      className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-50 transition-all text-center"
                    >
                      Become a Provider
                    </motion.a>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 flex justify-center" data-fade-anim>
                <div className="relative">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md">
                    <div className="grid grid-cols-2 gap-6">
                      {["⚡", "🚰", "🛠️", "🧹"].map((icon, i) => (
                        <motion.div
                          whileHover={{ y: -10, scale: 1.1, rotate: 5 }}
                          key={i}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl flex flex-col items-center justify-center shadow-lg"
                        >
                          <span className="text-4xl mb-3">{icon}</span>
                          <span className="text-sm font-semibold text-gray-700">
                            {["Electrical", "Plumbing", "Carpentry", "Cleaning"][i]}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Professionals", icon: <FiUser /> },
                { number: "2.5K+", label: "Completed Jobs", icon: <FiZap /> },
                { number: "98%", label: "Satisfaction", icon: <FiHeart /> },
                { number: "24/7", label: "Support", icon: <FiShield /> },
              ].map((stat, i) => (
                <div
                  key={i}
                  data-fade-anim
                  className="text-center p-8 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-blue-600 text-3xl mb-4 flex justify-center">
                    {stat.icon}
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-gradient-to-br from-blue-50 to-purple-50 relative z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16" data-fade-anim>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose BlueCollar?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We make finding and hiring skilled professionals simple, safe, and reliable
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "🛡️",
                  title: "Verified Professionals",
                  desc: "All providers undergo thorough background checks and verification",
                },
                {
                  icon: "💰",
                  title: "Transparent Pricing",
                  desc: "No hidden fees. Know exactly what you'll pay before booking",
                },
                {
                  icon: "⭐",
                  title: "Quality Guarantee",
                  desc: "100% satisfaction guarantee or we'll make it right",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  data-fade-anim
                  className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-2"
                >
                  <div className="text-5xl mb-6">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16" data-fade-anim>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Popular Services
              </h2>
              <p className="text-xl text-gray-600">
                Discover the services our customers love most
              </p>
            </div>

            {/* Search & Categories */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-3xl p-8 mb-12" data-fade-anim>
              <div className="relative mb-6">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-lg"
                />
              </div>

              <div className="flex overflow-x-auto space-x-4 pb-2">
                {categories.map((category) => (
                  <motion.button
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-3 rounded-2xl flex items-center whitespace-nowrap font-medium transition-all ${
                      selectedCategory === category.id
                        ? "bg-blue-600 text-white shadow-lg"
                        : "bg-white text-gray-700 hover:bg-gray-100 shadow-md"
                    }`}
                  >
                    <span className="mr-2 text-lg">{category.icon}</span>
                    {category.name}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Services Grid */}
            {loading ? (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                <div className="text-gray-600 text-lg">Loading services...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.slice(0, 6).map((service, i) => (
                  <motion.div
                    key={service.id}
                    data-fade-anim
                    whileHover={{ y: -10, scale: 1.02 }}
                    className="bg-white border border-gray-200 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-48 rounded-2xl mb-6 flex items-center justify-center">
                      <span className="text-6xl">
                        {categories.find((c) => c.id === service.category)?.icon}
                      </span>
                    </div>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">
                        {service.title}
                      </h4>
                      <div className="font-bold text-blue-600 text-lg">
                        ${service.price}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-6">
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {service.category}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <FiClock className="mr-1" />
                        <span>{service.duration}</span>
                      </div>
                    </div>

                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={`/service/${service.id}`}
                      className="w-full bg-gradient-to-r from-blue-600 to-teal-500 text-white py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center"
                    >
                      View Details <FiArrowRight className="ml-2" />
                    </motion.a>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* How It Works */}
        <section ref={howItWorksRef} className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 relative z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16" data-fade-anim>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Getting help with your home services has never been easier
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  number: "1",
                  title: "Search & Compare",
                  desc: "Browse services, read reviews, and compare prices from verified professionals",
                  icon: "🔍",
                },
                {
                  number: "2",
                  title: "Book Instantly",
                  desc: "Schedule a service at your convenience with our easy booking system",
                  icon: "📅",
                },
                {
                  number: "3",
                  title: "Get It Done",
                  desc: "Enjoy quality service with our satisfaction guarantee and support",
                  icon: "✅",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  data-fade-anim
                  className="bg-white p-8 rounded-3xl shadow-lg text-center hover:shadow-xl transition-all hover:-translate-y-2"
                >
                  <div className="text-6xl mb-6">{step.icon}</div>
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                    {step.number}
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef} className="py-20 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16" data-fade-anim>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Customer Reviews
              </h2>
              <p className="text-xl text-gray-600">
                Hear from our satisfied customers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  review: "The electrician arrived on time and fixed our wiring issue in no time. Professional and affordable!",
                  rating: 5,
                  avatar: "SJ",
                },
                {
                  name: "Michael Torres",
                  review: "Found a great plumber through BlueCollar who fixed our leak at a reasonable price. Will definitely use again.",
                  rating: 5,
                  avatar: "MT",
                },
                {
                  name: "Emma Williams",
                  review: "The cleaning service I found here did an amazing job. My house has never been cleaner!",
                  rating: 5,
                  avatar: "EW",
                },
              ].map((testimonial, i) => (
                <div
                  key={i}
                  data-fade-anim
                  className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all"
                >
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-500 rounded-full flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                      <div className="flex items-center text-yellow-500">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FiStar key={i} className="fill-current" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed italic">
                    "{testimonial.review}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section ref={ctaRef} className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-white relative z-20 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="max-w-4xl mx-auto text-center px-4 relative z-10">
            <div data-fade-anim>
              <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
              <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands of satisfied customers who found the perfect service professional
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <motion.a
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(255,255,255,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  href="/client-signup"
                  className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-xl transition-all"
                >
                  Find a Provider
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href="/provider-signup"
                  className="border-2 border-white text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all"
                >
                  Become a Provider
                </motion.a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  );
}