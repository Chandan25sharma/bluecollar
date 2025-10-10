"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { FiMessageSquare, FiStar } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsSection() {
  const testimonialsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = testimonialsRef.current;
    if (!section) return;

    // Testimonial cards animation
    gsap.fromTo(
      ".testimonial-card",
      { opacity: 0, y: 60, rotation: 2 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Floating animation for quote icons
    gsap.to(".quote-icon", {
      y: "random(-5, 5)",
      rotation: "random(-3, 3)",
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      stagger: 0.4,
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Homeowner",
      avatar: "SJ",
      rating: 5,
      text: "BlueCollar made finding a reliable plumber so easy! The booking process was seamless, and the professional arrived exactly on time. Excellent service quality and fair pricing.",
      service: "Plumbing Service",
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "Michael Chen",
      role: "Business Owner",
      avatar: "MC",
      rating: 5,
      text: "I've used BlueCollar for multiple office maintenance tasks. The platform consistently delivers quality professionals who understand business needs. Highly recommend!",
      service: "Office Cleaning",
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Emily Rodriguez",
      role: "Property Manager",
      avatar: "ER",
      rating: 5,
      text: "Managing multiple properties is challenging, but BlueCollar simplifies finding trusted contractors. The verification process gives me confidence in every booking.",
      service: "Property Maintenance",
      color: "from-teal-500 to-teal-600",
    },
    {
      name: "David Wilson",
      role: "Homeowner",
      avatar: "DW",
      rating: 5,
      text: "After a bad experience with another platform, BlueCollar restored my faith in online services. Professional, reliable, and transparent pricing. Will definitely use again!",
      service: "Electrical Work",
      color: "from-green-500 to-green-600",
    },
    {
      name: "Lisa Thompson",
      role: "Restaurant Owner",
      avatar: "LT",
      rating: 5,
      text: "Quick response time and professional service! Our kitchen equipment was fixed within hours of booking. BlueCollar understands the urgency of business needs.",
      service: "Appliance Repair",
      color: "from-pink-500 to-pink-600",
    },
    {
      name: "James Parker",
      role: "Homeowner",
      avatar: "JP",
      rating: 5,
      text: "The quality of work exceeded my expectations. The contractor was skilled, courteous, and completed the job ahead of schedule. Fantastic platform!",
      service: "Home Renovation",
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <section ref={testimonialsRef} className="py-20 bg-white relative z-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Customers
            </span>{" "}
            Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real customers have to
            say about their BlueCollar experience.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card group">
              <div className="relative bg-white rounded-3xl p-8 h-full border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 overflow-hidden">
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${testimonial.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}
                ></div>

                {/* Quote Icon */}
                <div className="relative z-10 mb-6">
                  <div
                    className={`quote-icon w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-xl flex items-center justify-center`}
                  >
                    <FiMessageSquare className="text-xl text-white" />
                  </div>
                </div>

                {/* Rating */}
                <div className="relative z-10 flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar
                      key={i}
                      className="text-yellow-400 fill-current text-lg"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <div className="relative z-10 mb-6">
                  <p className="text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors">
                    "{testimonial.text}"
                  </p>
                </div>

                {/* Service Tag */}
                <div className="relative z-10 mb-6">
                  <span
                    className={`inline-block bg-gradient-to-r ${testimonial.color} text-white text-sm px-3 py-1 rounded-full font-medium`}
                  >
                    {testimonial.service}
                  </span>
                </div>

                {/* Customer Info */}
                <div className="relative z-10 flex items-center gap-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold`}
                  >
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-500 text-sm group-hover:text-gray-600 transition-colors">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-4 left-4 w-8 h-8 bg-gradient-to-br from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  4.9/5
                </div>
                <div className="text-gray-600">Average Rating</div>
                <div className="flex justify-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-gray-600">Customer Satisfaction</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  10K+
                </div>
                <div className="text-gray-600">Positive Reviews</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button className="group bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-10 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
            Join Our Happy Customers
            <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}
