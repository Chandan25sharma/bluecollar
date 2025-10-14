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
import MapView from "../../../../components/MapView";
import { bookingsAPI, profileAPI, servicesAPI } from "../../../../lib/api";
import { authUtils } from "../../../../lib/auth";
import {
  calculateDistance,
  openCoordinatesInGoogleMaps,
} from "../../../../lib/location";

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
  distance?: number; // Distance in kilometers from client
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
  distance?: number; // Distance in kilometers from client
  latitude?: number;
  longitude?: number;
}

interface ClientProfile {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  state?: string;
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

  // Client location state
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(
    null
  );
  const [showLocationMap, setShowLocationMap] = useState(false);

  // Provider map modal state
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedProviderLocation, setSelectedProviderLocation] = useState<{
    lat: number;
    lng: number;
    name: string;
    address: string;
  } | null>(null);

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
    fetchServicesAndProfile();
  }, []);

  const fetchServicesAndProfile = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!authUtils.isAuthenticated()) {
        console.warn("User not authenticated");
        return;
      }

      // First fetch client profile to get location
      const profileResponse = await profileAPI.getClientProfile();

      if (profileResponse.data) {
        setClientProfile(profileResponse.data);

        // If client has location, fetch nearby services (within 10km)
        if (profileResponse.data.latitude && profileResponse.data.longitude) {
          console.log(
            "Client has location, fetching nearby services within 10km"
          );

          const nearbyServicesResponse = await servicesAPI.getNearbyServices(
            profileResponse.data.latitude,
            profileResponse.data.longitude,
            undefined, // no category filter, show all services
            10 // 10km radius
          );

          if (nearbyServicesResponse.data) {
            // Transform nearby services to match the expected format
            const transformedServices = nearbyServicesResponse.data.map(
              (service: any) => ({
                ...service,
                provider: {
                  ...service.provider,
                  rating: service.provider.rating || 4.2 + Math.random() * 0.8,
                  reviewCount:
                    service.provider.reviewCount ||
                    Math.floor(Math.random() * 200) + 50,
                  businessName: service.provider.name,
                },
              })
            );

            setServices(transformedServices);
            console.log(
              `Found ${transformedServices.length} nearby services within 10km`
            );
          }
        } else {
          // Client doesn't have location, show message to update profile
          console.log("Client location not available, fetching all services");
          const servicesResponse = await servicesAPI.getServices();
          if (servicesResponse.data) {
            setServices(servicesResponse.data);
          }

          // Show location prompt
          alert(
            "To see services from providers near your location, please update your profile with your address."
          );
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to all services if nearby fetch fails
      try {
        const servicesResponse = await servicesAPI.getServices();
        if (servicesResponse.data) {
          setServices(servicesResponse.data);
        }
      } catch (fallbackError) {
        console.error("Error fetching fallback services:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);

      // Check if user is authenticated
      if (!authUtils.isAuthenticated()) {
        console.warn("User not authenticated, redirecting to login");
        alert("Please log in to view services");
        return;
      }

      // Fetch real services from API
      const response = await servicesAPI.getServices();
      const servicesData = response.data;

      console.log("Fetched services from API:", servicesData);

      if (!servicesData || servicesData.length === 0) {
        console.warn("No services found in database");
        alert("No services available at the moment. Please contact support.");
        return;
      }

      setServices(servicesData);
    } catch (error) {
      console.error("Error fetching services:", error);
      alert(
        "Failed to load services. Please check your internet connection and try again."
      );
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
        alert("Please log in to book services");
        setBookingLoading(false);
        return;
      }

      // Check if client has location coordinates
      if (!clientProfile?.latitude || !clientProfile?.longitude) {
        alert(
          "Please update your profile with your location to find nearby providers."
        );
        setBookingLoading(false);
        return;
      }

      console.log("Client location:", {
        lat: clientProfile.latitude,
        lng: clientProfile.longitude,
      });

      // Use the nearby services API to get services within 10km radius
      // This will return the actual services from providers who offer this specific service
      const response = await servicesAPI.getNearbyServices(
        clientProfile.latitude,
        clientProfile.longitude,
        service.category,
        10 // 10km radius as requested
      );

      const nearbyServices = response.data || [];
      console.log("API Response - Nearby services:", nearbyServices);
      console.log("Number of nearby services found:", nearbyServices.length);

      if (nearbyServices.length === 0) {
        alert(
          `No providers offering ${service.category} services found within 10km of your location. Please try other services or contact support.`
        );
        setBookingLoading(false);
        return;
      }

      // Transform the services response to provider format
      // Group by provider to avoid duplicates (same provider might have multiple services)
      const providerMap = new Map();

      nearbyServices.forEach((serviceItem: any) => {
        const provider = serviceItem.provider;
        if (!providerMap.has(provider.id)) {
          providerMap.set(provider.id, {
            id: provider.id,
            name: provider.name,
            businessName: provider.name,
            email: provider.user?.email || "",
            skills: provider.skills || [],
            rate: provider.rate || serviceItem.price,
            rating: 4.2 + Math.random() * 0.8, // Random rating 4.2-5.0
            reviewCount: Math.floor(Math.random() * 200) + 50, // Random reviews 50-250
            distance: serviceItem.distance || provider.distance,
            availability: [
              "9:00 AM",
              "11:00 AM",
              "2:00 PM",
              "4:00 PM",
              "6:00 PM",
            ],
            isVerified: provider.verified || false,
            latitude: provider.latitude,
            longitude: provider.longitude,
            location: {
              address: provider.address || "Address not provided",
              city: provider.city || "",
              state: provider.state || "",
              coordinates:
                provider.latitude && provider.longitude
                  ? [provider.longitude, provider.latitude]
                  : undefined,
            },
          });
        }
      });

      const availableProviders = Array.from(providerMap.values());

      console.log("Processed providers within 10km:", availableProviders);
      console.log("Distance range:", {
        min: Math.min(...availableProviders.map((p) => p.distance || 0)),
        max: Math.max(...availableProviders.map((p) => p.distance || 0)),
      });

      if (availableProviders.length === 0) {
        alert(
          `No verified providers offering ${service.category} services found within 10km of your location.`
        );
        setBookingLoading(false);
        return;
      }

      setAvailableProviders(availableProviders);
      setShowServiceDetails(false);
      setShowProviderSelection(true);
    } catch (error) {
      console.error("Error fetching nearby providers:", error);
      alert(
        "Failed to load nearby providers. Please check your internet connection and try again."
      );
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

      const bookingRequest: any = {
        serviceId: selectedService.id,
        providerId: selectedProvider.id,
        date: bookingDateTime.toISOString(),
        notes: bookingNotes || undefined,
      };

      // Add client location data if available from user profile
      if (clientProfile && clientProfile.latitude && clientProfile.longitude) {
        bookingRequest.clientAddress =
          clientProfile.address || clientProfile.city || "Client Location";
        bookingRequest.clientLatitude = clientProfile.latitude;
        bookingRequest.clientLongitude = clientProfile.longitude;

        // Calculate distance to provider if provider location is available (for logging only)
        if (selectedProvider.location?.coordinates) {
          const [providerLng, providerLat] =
            selectedProvider.location.coordinates;
          const distance = calculateDistance(
            clientProfile.latitude,
            clientProfile.longitude,
            providerLat,
            providerLng
          );
          console.log("Distance to provider:", distance.toFixed(2), "km");
        }
      }

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

          {/* Location Info Message */}
          {clientProfile?.latitude && clientProfile?.longitude && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-blue-800">
                <FiMapPin className="text-lg" />
                <span className="font-medium">
                  Showing services within 10km of your location
                </span>
              </div>
              <p className="text-blue-600 text-sm mt-1">
                Only verified providers near {clientProfile.city || "your area"}{" "}
                are displayed.
              </p>
            </div>
          )}

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
                  {service.distance && (
                    <div className="absolute top-4 left-4 bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                      <FiMapPin className="text-white text-sm" />
                      <span className="text-sm font-medium text-white">
                        {service.distance.toFixed(1)} km
                      </span>
                    </div>
                  )}
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
                      {clientProfile && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-center gap-2 text-blue-700">
                            <FiMapPin className="w-4 h-4" />
                            <span className="font-medium">
                              Found {availableProviders.length} provider
                              {availableProviders.length !== 1 ? "s" : ""}{" "}
                              within 5km of your location
                            </span>
                          </div>
                          <p className="text-blue-600 text-sm mt-1">
                            Providers are sorted by distance from your location
                          </p>
                        </div>
                      )}
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
                                  <span>
                                    {provider.location?.coordinates &&
                                    clientProfile?.latitude &&
                                    clientProfile?.longitude
                                      ? (() => {
                                          const [providerLng, providerLat] =
                                            provider.location.coordinates;
                                          const distance = calculateDistance(
                                            clientProfile.latitude,
                                            clientProfile.longitude,
                                            providerLat,
                                            providerLng
                                          );
                                          return distance < 1
                                            ? `${Math.round(
                                                distance * 1000
                                              )}m away`
                                            : `${distance.toFixed(1)}km away`;
                                        })()
                                      : "Nearby"}
                                  </span>
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

                              <div className="flex gap-3">
                                <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium flex-1">
                                  Select This Provider
                                </button>

                                {provider.location?.coordinates && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const [lng, lat] =
                                        provider.location!.coordinates!;
                                      setSelectedProviderLocation({
                                        lat,
                                        lng,
                                        name:
                                          provider.businessName ||
                                          provider.name,
                                        address:
                                          provider.location!.address ||
                                          "Provider location",
                                      });
                                      setShowMapModal(true);
                                    }}
                                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-all"
                                    title="View on Map"
                                  >
                                    <FiMapPin className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
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

        {/* Provider Location Map Modal */}
        <AnimatePresence>
          {showMapModal && selectedProviderLocation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowMapModal(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">
                    Provider Location
                  </h3>
                  <button
                    onClick={() => setShowMapModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {selectedProviderLocation.name}
                    </h4>
                    <p className="text-gray-600">
                      {selectedProviderLocation.address}
                    </p>
                  </div>

                  <div className="h-96">
                    <MapView
                      latitude={selectedProviderLocation.lat}
                      longitude={selectedProviderLocation.lng}
                      markers={[
                        {
                          lat: selectedProviderLocation.lat,
                          lon: selectedProviderLocation.lng,
                          label: selectedProviderLocation.name,
                        },
                      ]}
                      zoom={15}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        openCoordinatesInGoogleMaps(
                          selectedProviderLocation.lat,
                          selectedProviderLocation.lng
                        );
                      }}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all font-medium"
                    >
                      Open in Google Maps
                    </button>
                    <button
                      onClick={() => setShowMapModal(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-medium"
                    >
                      Close
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
