"use client";

import { FiMail, FiPhone, FiMapPin, FiClock } from "react-icons/fi";

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg opacity-90">
            We’d love to hear from you! Reach out with any questions or feedback.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
          <form className="space-y-5">
            <div>
              <label className="block text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Subject</label>
              <input
                type="text"
                placeholder="Enter subject"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-gray-600 mb-1">Message</label>
              <textarea
                placeholder="Write your message..."
                rows={5}
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-gray-600">
              Our support team is available 24/7 to assist you. Reach out anytime.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
            <div className="flex items-center space-x-3">
              <FiMail className="text-blue-600 text-xl" />
              <span className="text-gray-700">support@bluecollar.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiPhone className="text-blue-600 text-xl" />
              <span className="text-gray-700">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiMapPin className="text-blue-600 text-xl" />
              <span className="text-gray-700">123 Main Street, New York, NY</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiClock className="text-blue-600 text-xl" />
              <span className="text-gray-700">Mon - Sun: 24/7 Support</span>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center">
            <span className="text-gray-500">[Google Map Embed Placeholder]</span>
          </div>
        </div>
      </section>
    </div>
  );
}
