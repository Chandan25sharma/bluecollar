"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import {
  FiArrowLeft,
  FiBell,
  FiBriefcase,
  FiCreditCard,
  FiEdit,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSave,
  FiSettings,
  FiShield,
  FiUpload,
  FiUser,
  FiX,
} from "react-icons/fi";
import ProviderHeader from "../../../../components/ProviderHeader";

interface Profile {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  businessAddress: string;
  bankAccount: string;
  routingNumber: string;
  taxId: string;
  services: string[];
  bio: string;
  avatar: string;
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export default function ProviderProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    businessName: "Smith Professional Services",
    businessAddress: "123 Business Ave, Suite 400, New York, NY 10001",
    bankAccount: "XXXX-XXXX-XXXX-1234",
    routingNumber: "XXXXXXX",
    taxId: "XX-XXXXXXX",
    services: ["Plumbing", "Electrical", "HVAC"],
    bio: "Licensed professional with 10+ years of experience in home services. Committed to quality work and customer satisfaction.",
    avatar: "",
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const [activeTab, setActiveTab] = useState<
    "profile" | "payment" | "preferences"
  >("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setProfile({
        ...profile,
        notificationPreferences: {
          ...profile.notificationPreferences,
          [name]: checked,
        },
      });
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleServiceChange = (service: string) => {
    setProfile((prev) => {
      const services = prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service];
      return { ...prev, services };
    });
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile({ ...profile, avatar: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);
    } catch (error) {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const availableServices = [
    "Plumbing",
    "Electrical",
    "HVAC",
    "Carpentry",
    "Painting",
    "Cleaning",
    "Landscaping",
    "Appliance Repair",
    "Handyman",
  ];

  return (
    <>
      <ProviderHeader />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/dashboard/provider"
              className="flex items-center text-green-600 hover:text-green-800 transition-colors font-medium"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {showMobileMenu && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100"
              >
                <div className="space-y-2">
                  <Link
                    href="/dashboard/provider/settings"
                    className="flex items-center text-gray-700 hover:text-green-600 p-2 rounded-lg hover:bg-gray-50"
                  >
                    <FiSettings className="mr-3" />
                    Settings
                  </Link>
                  <Link
                    href="/logout"
                    className="flex items-center text-red-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-50"
                  >
                    <FiLogOut className="mr-3" />
                    Logout
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-xl ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "profile"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FiUser className="mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("payment")}
                  className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "payment"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FiCreditCard className="mr-2" />
                  Payment
                </button>
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`flex items-center py-4 px-6 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === "preferences"
                      ? "border-green-500 text-green-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <FiBell className="mr-2" />
                  Preferences
                </button>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="flex-shrink-0">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt="Profile"
                          className="h-24 w-24 rounded-full object-cover border-4 border-gray-100"
                        />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold border-4 border-gray-100">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Photo
                      </label>
                      <label
                        htmlFor="avatar-upload"
                        className="cursor-pointer inline-flex items-center"
                      >
                        <span className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                          <FiUpload className="mr-2" />
                          Change Photo
                        </span>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarUpload}
                          disabled={!isEditing}
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        JPG, PNG or GIF - Max 5MB
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="businessName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Business Name
                      </label>
                      <div className="relative">
                        <FiBriefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          id="businessName"
                          name="businessName"
                          value={profile.businessName}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profile.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="businessAddress"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Business Address
                    </label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="text"
                        id="businessAddress"
                        name="businessAddress"
                        value={profile.businessAddress}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Services Offered
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {availableServices.map((service) => (
                        <label
                          key={service}
                          className="flex items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={profile.services.includes(service)}
                              onChange={() => handleServiceChange(service)}
                              disabled={!isEditing}
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded disabled:bg-gray-100"
                            />
                          </div>
                          <span className="ml-3 text-sm text-gray-700">
                            {service}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Professional Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Tell clients about your experience and expertise..."
                    />
                  </div>
                </div>
              )}

              {/* Payment Tab */}
              {activeTab === "payment" && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex">
                      <FiShield className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Your payment information is securely encrypted and
                        stored. We never share your banking details.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="bankAccount"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        id="bankAccount"
                        name="bankAccount"
                        value={profile.bankAccount}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="XXXX-XXXX-XXXX-1234"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="routingNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Routing Number
                      </label>
                      <input
                        type="text"
                        id="routingNumber"
                        name="routingNumber"
                        value={profile.routingNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="XXXXXXX"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="taxId"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Tax ID (EIN/SSN)
                      </label>
                      <input
                        type="text"
                        id="taxId"
                        name="taxId"
                        value={profile.taxId}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="XX-XXXXXXX"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Notification Preferences
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive important updates via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="email"
                            checked={profile.notificationPreferences.email}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            SMS Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive text message alerts
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="sms"
                            checked={profile.notificationPreferences.sms}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Push Notifications
                          </p>
                          <p className="text-sm text-gray-500">
                            Receive app notifications
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            name="push"
                            checked={profile.notificationPreferences.push}
                            onChange={handleChange}
                            disabled={!isEditing}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600 disabled:opacity-50"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <FiX className="inline mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-md transition-all disabled:opacity-50"
                    >
                      {isLoading ? (
                        "Saving..."
                      ) : (
                        <>
                          <FiSave className="inline mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-teal-500 text-white rounded-xl font-medium hover:shadow-md transition-all"
                  >
                    <FiEdit className="inline mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </form>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
              {/* Settings Button */}
              <Link
                href="/dashboard/provider/settings"
                className="flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-600 transition-all shadow-sm md:shadow-none"
              >
                <FiSettings className="mr-2" size={18} />
                <span className="hidden md:inline">Settings</span>
                <span className="md:hidden">Settings</span>
              </Link>

              {/* Logout Button */}
              <Link
                href="/logout"
                className="flex items-center justify-center w-full md:w-auto px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 font-medium transition-all shadow-sm md:shadow-none"
              >
                Logout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
