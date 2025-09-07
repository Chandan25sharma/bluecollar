"use client";

import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header />
{/* Hero */}
<section className="relative bg-gradient-to-r from-green-600 to-teal-500 text-white py-20 px-6">
  {/* Back Button */}
  <div className="absolute top-4 left-4">
    <button
      onClick={() => router.back()}
      className="flex items-center text-white font-medium hover:text-yellow-300 transition"
    >
      <FiArrowLeft className="mr-2" /> Back
    </button>
  </div>

  <div className="max-w-5xl mx-auto text-center">
    <motion.h1
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl md:text-5xl font-bold mb-4"
    >
      About <span className="text-yellow-300">BlueCollar</span>
    </motion.h1>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto"
    >
      Connecting people with trusted blue-collar professionals since 2023.
    </motion.p>
  </div>
</section>


      {/* Mission */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            At BlueCollar, our mission is to empower skilled professionals and make it seamless
            for customers to access reliable services. We bridge the gap between supply and demand in the blue-collar workforce.
          </p>
          <p className="text-gray-700">
            Whether you need an electrician, plumber, carpenter, or tailor — we've got you covered.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-green-50 rounded-2xl h-64 flex items-center justify-center shadow-md"
        >
          <span className="text-green-400">Illustration / Image Here</span>
        </motion.div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-white px-6">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Our Core Values
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-10">
            We believe in building trust, offering affordability, and ensuring convenience for our clients and professionals alike.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Trust",
              desc: "Every provider is verified to ensure quality and reliability.",
              color: "bg-green-100 text-green-700",
            },
            {
              title: "Affordability",
              desc: "Transparent pricing ensures you get the best value for your money.",
              color: "bg-teal-100 text-teal-700",
            },
            {
              title: "Convenience",
              desc: "Book services anytime, anywhere — hassle-free.",
              color: "bg-green-50 text-green-800",
            },
          ].map((value, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl shadow-md border border-gray-100 text-center ${value.color}`}
            >
              <h3 className="font-bold text-xl mb-2">{value.title}</h3>
              <p className="text-gray-700">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4"
          >
            Meet Our Team
          </motion.h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A dedicated team passionate about connecting communities with skilled professionals.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Chandan Sharma", role: "Founder & CEO" },
            { name: "Aisha Khan", role: "Head of Operations" },
            { name: "David Lee", role: "Tech Lead" },
          ].map((member, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition text-center"
            >
              <div className="w-24 h-24 bg-green-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-400 text-sm">Photo</span>
              </div>
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-green-600 to-teal-500 text-white text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold mb-6"
        >
          Join Us On Our Journey
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 opacity-90 max-w-md mx-auto"
        >
          Be part of a growing community of skilled professionals and satisfied customers.
        </motion.p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="/services"
          className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
        >
          Explore Services
        </motion.a>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
