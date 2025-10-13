"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiClock,
  FiFilter,
  FiMapPin,
  FiSearch,
  FiStar,
  FiX,
} from "react-icons/fi";
import ClientHeader from "../../../../components/ClientHeader";
import { bookingsAPI, profileAPI, servicesAPI } from "../../../../lib/api";
import { authUtils } from "../../../../lib/auth";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
  provider: {
    id: string;
    businessName: string;
    rating?: number;
    reviewCount?: number;
  };
  createdAt: string;
  updatedAt?: string;
}

interface Provider {
  id: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  skills: string[];
  rate: number;
  rating?: number;
  reviewCount?: number;
  location?: {
    address?: string;
    city?: string;
    state?: string;
    coordinates?: [number, number];
  };
  availability?: string[];
  isVerified: boolean;
  profileImage?: string;
}

interface BookingRequest {
  serviceId: string;
  providerId?: string;
  date: string; // ISO string of the combined date and time
  notes?: string;
  clientAddress?: string;
  clientLatitude?: number;
  clientLongitude?: number;
}

export default function ClientServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  // Booking flow states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [availableProviders, setAvailableProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null
  );
  const [showProviderSelection, setShowProviderSelection] = useState(false);
  const [showTimeSelection, setShowTimeSelection] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!authUtils.isAuthenticated()) {
        console.warn("User not authenticated");
        return;
      }

      // Fetch real services from API
      const response = await servicesAPI.getServices();
      const servicesData = response.data;

      console.log("Fetched services:", servicesData);
      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);

      // Fallback to mock data if API fails
      const mockServices: Service[] = [
        {
          id: "1",
          title: "Electrical Wiring Installation",
          description:
            "Professional electrical wiring for homes and offices. Complete installation with safety certification.",
          price: 150,
          category: "Electrical",
          duration: "2-3 hours",
          isActive: true,
          provider: {
            id: "provider1",
            businessName: "ElectricPro Services",
            rating: 4.8,
            reviewCount: 124,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Plumbing Repair & Installation",
          description:
            "Expert plumbing services including repairs, installations, and emergency fixes.",
          price: 120,
          category: "Plumbing",
          duration: "1-2 hours",
          isActive: true,
          provider: {
            id: "provider2",
            businessName: "PlumbFix Solutions",
            rating: 4.6,
            reviewCount: 89,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "House Cleaning Service",
          description:
            "Deep cleaning service for residential properties. Eco-friendly products used.",
          price: 80,
          category: "Cleaning",
          duration: "2-4 hours",
          isActive: true,
          provider: {
            id: "provider3",
            businessName: "CleanSweep Co.",
            rating: 4.9,
            reviewCount: 203,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          title: "HVAC Installation & Repair",
          description:
            "Heating, ventilation, and air conditioning services by certified technicians.",
          price: 200,
          category: "HVAC",
          duration: "3-5 hours",
          isActive: true,
          provider: {
            id: "provider4",
            businessName: "CoolAir HVAC",
            rating: 4.7,
            reviewCount: 156,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "5",
          title: "Interior Painting",
          description:
            "Professional interior painting with premium quality paints and finishes.",
          price: 300,
          category: "Painting",
          duration: "1-2 days",
          isActive: true,
          provider: {
            id: "provider5",
            businessName: "ColorCraft Painters",
            rating: 4.8,
            reviewCount: 178,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "6",
          title: "Carpentry & Woodwork",
          description:
            "Custom carpentry services including furniture repair and installation.",
          price: 180,
          category: "Carpentry",
          duration: "3-6 hours",
          isActive: true,
          provider: {
            id: "provider6",
            businessName: "WoodCraft Masters",
            rating: 4.5,
            reviewCount: 92,
          },
          createdAt: new Date().toISOString(),
        },
      ];

      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Services", icon: "🔧" },
    { id: "Electrical", name: "Electrical", icon: "⚡" },
    { id: "Plumbing", name: "Plumbing", icon: "🚰" },
    { id: "Cleaning", name: "Cleaning", icon: "🧹" },
    { id: "HVAC", name: "HVAC", icon: "❄️" },
    { id: "Painting", name: "Painting", icon: "🎨" },
    { id: "Carpentry", name: "Carpentry", icon: "🪚" },
  ];

  // Booking flow functions
  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setShowServiceDetails(true);
  };

  const handleBookNow = async (service: Service) => {
    console.log("=== handleBookNow called ===");
    console.log("Service:", service);
    console.log("Current states:", {
      showProviderSelection,
      showServiceDetails,
      bookingLoading,
      availableProviders: availableProviders.length,
    });

    setSelectedService(service);
    setBookingLoading(true);

    try {
      console.log(
        "Fetching providers for service:",
        service.title,
        "category:",
        service.category
      );

      // Check authentication status
      const isAuthenticated = authUtils.isAuthenticated();
      console.log("User authenticated:", isAuthenticated);

      if (!isAuthenticated) {
        console.warn("User not authenticated, using mock data");
        throw new Error("Not authenticated");
      }

      // Fetch available providers for this service category
      const response = await profileAPI.getAllProviders({
        skills: service.category, // Pass the category as the skills filter
      });

      const providersData = response.data || [];
      console.log("API Response - Fetched providers:", providersData);
      console.log("Number of providers found:", providersData.length);

      // Transform providers data to include pricing and availability
      const transformedProviders: Provider[] = providersData.map(
        (provider: any) => ({
          ...provider,
          availability: provider.availability || [
            "9:00 AM",
            "11:00 AM",
            "2:00 PM",
            "4:00 PM",
          ],
          rating: provider.rating || 4.5,
          reviewCount: provider.reviewCount || 0,
        })
      );

      console.log("Transformed providers:", transformedProviders);
      setAvailableProviders(transformedProviders);
      setShowServiceDetails(false);
      setShowProviderSelection(true);
    } catch (error) {
      console.error("Error fetching providers:", error);
      console.log("Falling back to mock providers...");

      // Fallback to mock providers if API fails
      const mockProviders: Provider[] = [
        {
          id: "1",
          name: "Elite Services Co.",
          businessName: "Elite Services Co.",
          email: "elite@example.com",
          skills: [service.category],
          rate: service.price,
          rating: 4.8,
          reviewCount: 245,
          availability: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
          isVerified: true,
          location: {
            address: "Downtown Area",
            city: "City Center",
            coordinates: [-74.0059, 40.7128],
          },
        },
        {
          id: "2",
          name: "Quick Fix Solutions",
          businessName: "Quick Fix Solutions",
          email: "quickfix@example.com",
          skills: [service.category],
          rate: service.price + 20,
          rating: 4.6,
          reviewCount: 189,
          availability: ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
          isVerified: true,
          location: {
            address: "North Side",
            city: "North District",
            coordinates: [-74.0059, 40.7228],
          },
        },
        {
          id: "3",
          name: "Professional Home Care",
          businessName: "Professional Home Care",
          email: "homecare@example.com",
          skills: [service.category],
          rate: service.price - 15,
          rating: 4.9,
          reviewCount: 312,
          availability: ["8:00 AM", "12:00 PM", "3:00 PM"],
          isVerified: true,
          location: {
            address: "South District",
            city: "South Side",
            coordinates: [-74.0059, 40.7028],
          },
        },
        {
          id: "4",
          name: "Premium Service Pros",
          businessName: "Premium Service Pros",
          email: "premium@example.com",
          skills: [service.category],
          rate: service.price + 50,
          rating: 4.9,
          reviewCount: 156,
          availability: ["7:00 AM", "9:00 AM", "1:00 PM", "5:00 PM"],
          isVerified: true,
          location: {
            address: "Uptown District",
            city: "Premium Area",
            coordinates: [-74.0159, 40.7328],
          },
        },
        {
          id: "5",
          name: "Budget Friendly Services",
          businessName: "Budget Friendly Services",
          email: "budget@example.com",
          skills: [service.category],
          rate: service.price - 25,
          rating: 4.4,
          reviewCount: 89,
          availability: ["10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"],
          isVerified: true,
          location: {
            address: "East Side",
            city: "Affordable District",
            coordinates: [-74.0259, 40.7128],
          },
        },
        {
          id: "6",
          name: "Expert Craftsmen",
          businessName: "Expert Craftsmen",
          email: "experts@example.com",
          skills: [service.category],
          rate: service.price + 10,
          rating: 4.7,
          reviewCount: 203,
          availability: ["8:00 AM", "11:00 AM", "3:00 PM"],
          isVerified: true,
          location: {
            address: "West End",
            city: "Craft District",
            coordinates: [-74.0359, 40.7228],
          },
        },
        {
          id: "7",
          name: "Reliable Home Solutions",
          businessName: "Reliable Home Solutions",
          email: "reliable@example.com",
          skills: [service.category],
          rate: service.price,
          rating: 4.5,
          reviewCount: 134,
          availability: ["9:00 AM", "12:00 PM", "4:00 PM", "7:00 PM"],
          isVerified: true,
          location: {
            address: "Central Park Area",
            city: "Midtown",
            coordinates: [-74.0059, 40.7628],
          },
        },
      ];

      setAvailableProviders(mockProviders);
      setShowServiceDetails(false);
      setShowProviderSelection(true);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowProviderSelection(false);
    setShowTimeSelection(true);
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleBookingSubmit = async () => {
    console.log("=== handleBookingSubmit called ===");
    console.log("selectedService:", selectedService);
    console.log("selectedProvider:", selectedProvider);
    console.log("selectedDate:", selectedDate);
    console.log("selectedTime:", selectedTime);

    if (
      !selectedService ||
      !selectedProvider ||
      !selectedDate ||
      !selectedTime
    ) {
      console.error("Missing required booking data:", {
        selectedService: !!selectedService,
        selectedProvider: !!selectedProvider,
        selectedDate,
        selectedTime,
      });
      alert("Please fill in all required fields.");
      return;
    }

    setBookingLoading(true);

    try {
      // Convert 12-hour time format to 24-hour format
      const convertTo24Hour = (time12h: string) => {
        const [time, modifier] = time12h.split(" ");
        let [hours, minutes] = time.split(":");
        if (hours === "12") {
          hours = "00";
        }
        if (modifier === "PM") {
          hours = (parseInt(hours, 10) + 12).toString();
        }
        return `${hours.padStart(2, "0")}:${minutes}`;
      };

      // Combine date and time into a DateTime object
      const time24h = convertTo24Hour(selectedTime);
      const bookingDateTime = new Date(`${selectedDate}T${time24h}:00`);

      const bookingRequest = {
        serviceId: selectedService.id,
        providerId: selectedProvider.id,
        date: bookingDateTime.toISOString(),
        notes: bookingNotes || undefined,
      };

      console.log("Submitting booking request:", bookingRequest);
      console.log(
        "Original time:",
        selectedTime,
        "Converted:",
        time24h,
        "DateTime:",
        bookingDateTime
      );
      console.log(
        "Service ID type and value:",
        typeof selectedService.id,
        selectedService.id
      );
      console.log(
        "Provider ID type and value:",
        typeof selectedProvider.id,
        selectedProvider.id
      );

      // Validate that we have valid IDs
      if (!selectedService.id || typeof selectedService.id !== "string") {
        console.error("Invalid service ID:", selectedService.id);
        alert("Invalid service selected. Please try again.");
        return;
      }

      if (!selectedProvider.id || typeof selectedProvider.id !== "string") {
        console.error("Invalid provider ID:", selectedProvider.id);
        alert("Invalid provider selected. Please try again.");
        return;
      }

      // Check if user is authenticated before making API call
      if (!authUtils.isAuthenticated()) {
        console.error("User not authenticated");
        alert("Please log in to make a booking.");
        return;
      }

      // Submit booking request to API
      const response = await bookingsAPI.createBooking(bookingRequest);
      console.log("Booking created successfully:", response.data);

      // Show success message and reset state
      alert(
        "Booking request sent successfully! The provider will be notified and you'll receive a confirmation."
      );
      resetBookingFlow();
    } catch (error: any) {
      console.error("Error submitting booking:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
      });

      // Try fallback booking method or show appropriate error
      if (error.response?.status === 401) {
        alert("Please log in again to make a booking.");
      } else if (error.response?.status === 404) {
        alert(
          "Service or provider not found. Please try selecting a different option."
        );
      } else if (error.response?.status >= 500) {
        // Server error - use mock booking for development
        console.log("Server error, using mock booking for development");
        alert(
          "Booking request submitted! (Development mode - server issue detected)\n" +
            `Service: ${selectedService.title}\n` +
            `Provider: ${
              selectedProvider.businessName || selectedProvider.name
            }\n` +
            `Date: ${selectedDate}\n` +
            `Time: ${selectedTime}`
        );
        resetBookingFlow();
      } else {
        // Show more specific error message
        const errorMessage =
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Unknown error occurred";

        alert(`Failed to submit booking request: ${errorMessage}`);
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const resetBookingFlow = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setShowServiceDetails(false);
    setShowProviderSelection(false);
    setShowTimeSelection(false);
    setSelectedDate("");
    setSelectedTime("");
    setBookingNotes("");
  };

  const generateTimeSlots = () => {
    const today = new Date();
    const dates = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split("T")[0],
        label: date.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      });
    }

    return dates;
  };

  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.provider.rating || 0) - (a.provider.rating || 0);
        case "title":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-green-600 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ClientHeader />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 pb-20 md:pb-0">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-16 px-4 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <defs>
                <pattern
                  id="heroPattern"
                  width="20"
                  height="20"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="10" cy="10" r="2" fill="currentColor" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#heroPattern)" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Professional Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto"
            >
              Connect with trusted professionals for all your home and business
              needs
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-xl" />
                </div>
                <input
                  type="text"
                  placeholder="Search for services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-gray-900 rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 border-0 text-lg"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md"
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700"
              >
                <FiFilter />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            <p className="text-gray-600">
              {filteredServices.length} services available
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
                onClick={() => handleServiceClick(service)}
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <FiStar className="text-yellow-500 text-sm" />
                    <span className="text-sm font-medium">
                      {service.provider.rating || 4.5}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiClock className="text-sm" />
                      <span className="text-sm">{service.duration}</span>
                    </div>
                    <div className="text-gray-500 text-sm">
                      {service.provider.reviewCount || 0} reviews
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">
                      ${service.price}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log(
                          "Book Now clicked for service:",
                          service.title
                        );
                        handleBookNow(service);
                      }}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch className="text-gray-400 text-3xl" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No services found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Service Details Modal */}
        <AnimatePresence>
          {showServiceDetails && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={resetBookingFlow}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="relative">
                  <div className="h-64 bg-gradient-to-br from-green-100 to-emerald-100 relative">
                    <button
                      onClick={resetBookingFlow}
                      className="absolute top-4 right-4 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="p-8">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                        <FiStar className="text-yellow-500 text-sm" />
                        <span className="text-sm font-medium">
                          {selectedService.provider.rating || 4.5}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({selectedService.provider.reviewCount || 0} reviews)
                        </span>
                      </div>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {selectedService.title}
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                      {selectedService.description}
                    </p>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FiClock className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="font-medium">
                            {selectedService.duration}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">$</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">
                            Starting Price
                          </p>
                          <p className="font-medium text-2xl text-green-600">
                            ${selectedService.price}
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBookNow(selectedService)}
                      disabled={bookingLoading}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50"
                    >
                      {bookingLoading
                        ? "Finding Providers..."
                        : "Book This Service"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Provider Selection Modal */}
        <AnimatePresence>
          {showProviderSelection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={resetBookingFlow}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Choose a Provider
                    </h2>
                    <button
                      onClick={resetBookingFlow}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>

                  {bookingLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                      <span className="ml-3 text-gray-600">
                        Loading providers...
                      </span>
                    </div>
                  ) : availableProviders.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500">
                        No providers available for this service.
                      </p>
                      <button
                        onClick={resetBookingFlow}
                        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {availableProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="border border-gray-200 rounded-xl p-6 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer"
                          onClick={() => handleProviderSelect(provider)}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                              <span className="text-2xl font-bold text-green-600">
                                {(
                                  provider.businessName || provider.name
                                ).charAt(0)}
                              </span>
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {provider.businessName || provider.name}
                                </h3>
                                <div className="text-2xl font-bold text-green-600">
                                  ${provider.rate}
                                </div>
                              </div>

                              <div className="flex items-center gap-4 mb-3">
                                <div className="flex items-center gap-1">
                                  <FiStar className="text-yellow-500" />
                                  <span className="font-medium">
                                    {provider.rating || 4.5}
                                  </span>
                                  <span className="text-gray-500">
                                    ({provider.reviewCount || 0} reviews)
                                  </span>
                                </div>

                                <div className="flex items-center gap-1 text-gray-500">
                                  <FiMapPin className="text-sm" />
                                  <span>Nearby</span>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {provider.skills.map(
                                  (skill: string, index: number) => (
                                    <span
                                      key={index}
                                      className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                                {provider.isVerified && (
                                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                                    Verified
                                  </span>
                                )}
                              </div>

                              <p className="text-gray-600 mb-4">
                                Location:{" "}
                                {provider.location?.address ||
                                  provider.location?.city ||
                                  "Available in your area"}
                              </p>

                              <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium">
                                Select This Provider
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Time Selection Modal */}
        <AnimatePresence>
          {showTimeSelection && selectedProvider && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={resetBookingFlow}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Select Date & Time
                    </h2>
                    <button
                      onClick={resetBookingFlow}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Provider: {selectedProvider.businessName}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin />
                      <span>
                        {selectedProvider?.location?.address ||
                          selectedProvider?.location?.city ||
                          "Nearby"}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">Select Date</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {generateTimeSlots().map((date) => (
                        <button
                          key={date.value}
                          onClick={() => setSelectedDate(date.value)}
                          className={`p-3 text-center rounded-lg border-2 transition-all ${
                            selectedDate === date.value
                              ? "border-green-600 bg-green-50 text-green-700"
                              : "border-gray-200 hover:border-green-300"
                          }`}
                        >
                          {date.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedDate && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3">Available Times</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {(
                          selectedProvider?.availability || [
                            "9:00 AM",
                            "10:00 AM",
                            "11:00 AM",
                            "2:00 PM",
                            "3:00 PM",
                            "4:00 PM",
                          ]
                        ).map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3 text-center rounded-lg border-2 transition-all ${
                              selectedTime === time
                                ? "border-green-600 bg-green-50 text-green-700"
                                : "border-gray-200 hover:border-green-300"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mb-6">
                    <h4 className="font-semibold mb-3">
                      Additional Notes (Optional)
                    </h4>
                    <textarea
                      value={bookingNotes}
                      onChange={(e) => setBookingNotes(e.target.value)}
                      placeholder="Any specific requirements or instructions..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        ${selectedProvider?.rate || 50}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        console.log("Submit booking button clicked");
                        console.log("Current booking state:", {
                          selectedService: selectedService?.title,
                          selectedProvider: selectedProvider?.name,
                          selectedDate,
                          selectedTime,
                          bookingLoading,
                        });
                        handleBookingSubmit();
                      }}
                      disabled={
                        !selectedDate || !selectedTime || bookingLoading
                      }
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {bookingLoading
                        ? "Sending Request..."
                        : "Send Booking Request"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
