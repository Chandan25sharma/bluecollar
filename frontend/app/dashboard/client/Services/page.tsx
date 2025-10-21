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
import { profileAPI, servicesAPI } from "../../../../lib/api";
import { authUtils } from "../../../../lib/auth";
import {
  calculateDistance,
  openCoordinatesInGoogleMaps,
} from "../../../../lib/location";
import CreateBookingWithPayment from "../../../../src/components/CreateBookingWithPayment";

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
    name: string;
    rate: number;
    verified: boolean;
    rating?: number;
    reviewCount?: number;
    user: {
      email: string;
      phone: string;
    };
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

  // Location selection states
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [selectedServiceLocation, setSelectedServiceLocation] = useState<{
    address: string;
    latitude: number;
    longitude: number;
    city?: string;
    state?: string;
  } | null>(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [pickerLocation, setPickerLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [pickedAddress, setPickedAddress] = useState<{
    address: string;
    city: string;
    state: string;
    country: string;
  } | null>(null);
  const [isMapMode, setIsMapMode] = useState(true); // true for map, false for address input

  // Booking flow states
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showServiceDetails, setShowServiceDetails] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

      // First fetch client profile to save location for later use
      const profileResponse = await profileAPI.getClientProfile();
      if (profileResponse.data) {
        setClientProfile(profileResponse.data);
      }

      // Always fetch ALL services regardless of location
      console.log("Fetching all available services");
      const servicesResponse = await servicesAPI.getServices();

      if (servicesResponse.data) {
        // Transform services to match expected format
        const transformedServices = servicesResponse.data.map(
          (service: any) => ({
            ...service,
            provider: {
              ...service.provider,
              rating: service.provider.rating || 4.2 + Math.random() * 0.8,
              reviewCount:
                service.provider.reviewCount ||
                Math.floor(Math.random() * 200) + 50,
              businessName: service.provider.name,
              name: service.provider.name,
              rate: service.provider.rate || service.price,
              verified: service.provider.verified || false,
              user: service.provider.user || {
                email: service.provider.email || "provider@example.com",
                phone: service.provider.phone || "+91-XXXXXXXXXX",
              },
            },
          })
        );
        setServices(transformedServices);
        console.log(`Found ${transformedServices.length} total services`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Fallback to all services if nearby fetch fails
      try {
        const servicesResponse = await servicesAPI.getServices();
        if (servicesResponse.data) {
          // Transform services to match expected format
          const transformedServices = servicesResponse.data.map(
            (service: any) => ({
              ...service,
              provider: {
                ...service.provider,
                rating: service.provider.rating || 4.2 + Math.random() * 0.8,
                reviewCount:
                  service.provider.reviewCount ||
                  Math.floor(Math.random() * 200) + 50,
                businessName: service.provider.name,
                name: service.provider.name,
                rate: service.provider.rate || service.price,
                verified: service.provider.verified || false,
                user: service.provider.user || {
                  email: service.provider.email || "provider@example.com",
                  phone: service.provider.phone || "+91-XXXXXXXXXX",
                },
              },
            })
          );
          setServices(transformedServices);
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

      // Transform services to match expected format
      const transformedServices = servicesData.map((service: any) => ({
        ...service,
        provider: {
          ...service.provider,
          rating: service.provider.rating || 4.2 + Math.random() * 0.8,
          reviewCount:
            service.provider.reviewCount ||
            Math.floor(Math.random() * 200) + 50,
          businessName: service.provider.name,
          name: service.provider.name,
          rate: service.provider.rate || service.price,
          verified: service.provider.verified || false,
          user: service.provider.user || {
            email: service.provider.email || "provider@example.com",
            phone: service.provider.phone || "+91-XXXXXXXXXX",
          },
        },
      }));

      setServices(transformedServices);
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

    // Check authentication status first
    const isAuthenticated = authUtils.isAuthenticated();
    console.log("User authenticated:", isAuthenticated);

    if (!isAuthenticated) {
      alert("Please log in to book services");
      return;
    }

    // Check if client has location in profile
    if (!clientProfile?.latitude || !clientProfile?.longitude) {
      alert(
        "Please update your profile with your location to find nearby providers."
      );
      return;
    }

    // Set default location to client's saved location
    setSelectedServiceLocation({
      address: clientProfile.address || "Your saved location",
      latitude: clientProfile.latitude,
      longitude: clientProfile.longitude,
      city: clientProfile.city,
      state: clientProfile.state,
    });

    // Show location selection modal
    setShowLocationSelection(true);
  };

  const handleLocationConfirm = async () => {
    if (!selectedService || !selectedServiceLocation) return;

    setBookingLoading(true);
    setShowLocationSelection(false);

    try {
      console.log("Searching providers for location:", selectedServiceLocation);

      // Use the nearby services API to get services within 10km radius
      const response = await servicesAPI.getNearbyServices(
        selectedServiceLocation.latitude,
        selectedServiceLocation.longitude,
        selectedService.category,
        10 // 10km radius
      );

      const nearbyServices = response.data || [];
      console.log("API Response - Nearby services:", nearbyServices);

      if (nearbyServices.length === 0) {
        alert(
          `No providers offering ${selectedService.category} services found within 10km of the selected location. Please try a different location.`
        );
        setBookingLoading(false);
        return;
      }

      // Transform the services response to provider format
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
            rating: 4.2 + Math.random() * 0.8,
            reviewCount: Math.floor(Math.random() * 200) + 50,
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
          `No verified providers offering ${selectedService.category} services found within 10km of the selected location.`
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

  // Function to get address from coordinates (reverse geocoding)
  const getAddressFromCoordinates = async (lat: number, lon: number) => {
    try {
      setIsLoadingAddress(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.display_name) {
        const address = {
          address: data.display_name,
          city:
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            "",
          state: data.address?.state || "",
          country: data.address?.country || "",
        };
        setPickedAddress(address);
        return address;
      }
    } catch (error) {
      console.error("Error getting address:", error);
    } finally {
      setIsLoadingAddress(false);
    }
    return null;
  };

  // Handle map click for location picking
  const handleMapLocationClick = async (lat: number, lon: number) => {
    setPickerLocation({ latitude: lat, longitude: lon });
    await getAddressFromCoordinates(lat, lon);
  };

  // Confirm picked location
  const handlePickedLocationConfirm = () => {
    if (pickerLocation && pickedAddress) {
      setSelectedServiceLocation({
        address: pickedAddress.address,
        latitude: pickerLocation.latitude,
        longitude: pickerLocation.longitude,
        city: pickedAddress.city,
        state: pickedAddress.state,
      });
      setShowLocationPicker(false);
      setShowLocationSelection(true);
    }
  };

  // Get current location using browser geolocation
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setPickerLocation({ latitude: lat, longitude: lng });
          await getAddressFromCoordinates(lat, lng);
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert(
            "Could not access your current location. Please pick a location on the map."
          );
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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

    // Close time selection modal and open payment modal
    setShowTimeSelection(false);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (booking: any) => {
    console.log("Payment successful, booking confirmed:", booking);
    alert(
      "Payment successful! Your booking has been confirmed and the provider has been notified."
    );
    resetBookingFlow();
  };

  const resetBookingFlow = () => {
    setSelectedService(null);
    setSelectedProvider(null);
    setShowServiceDetails(false);
    setShowLocationSelection(false);
    setSelectedServiceLocation(null);
    setShowLocationPicker(false);
    setPickerLocation(null);
    setPickedAddress(null);
    setIsLoadingAddress(false);
    setIsMapMode(true);
    setShowProviderSelection(false);
    setShowTimeSelection(false);
    setShowPaymentModal(false);
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
        {/* Hero Section - Compact */}
        <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 text-white py-8 md:py-12 px-4 relative overflow-hidden">
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
              className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4"
            >
              Professional Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm md:text-lg lg:text-xl text-green-100 mb-4 md:mb-6 max-w-2xl mx-auto"
            >
              Connect with trusted professionals for all your home and business
              needs
            </motion.p>

            {/* Compact Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-lg mx-auto"
            >
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400 text-lg" />
                </div>
                <input
                  type="text"
                  placeholder="Search services..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-gray-900 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 border-0 text-sm md:text-base"
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Category Filters - Compact */}
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all flex items-center gap-1 md:gap-2 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105"
                    : "bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 shadow-md"
                }`}
              >
                <span className="text-sm md:text-base">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>

          {/* General Info Message */}
          <div className="mb-4 md:mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <span className="text-base md:text-lg">🔧</span>
              <span className="font-medium text-xs md:text-sm">
                Browse all available services - we'll find nearby providers
                after you select a service
              </span>
            </div>
          </div>

          {/* Compact Filters & Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow text-gray-700 text-sm"
              >
                <FiFilter className="text-sm" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 text-sm"
              >
                <option value="popular">Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="title">A-Z</option>
              </select>
            </div>

            <p className="text-gray-600 text-sm">
              {filteredServices.length} services
            </p>
          </div>

          {/* Services Grid - Compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredServices.map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden"
                onClick={() => handleServiceClick(service)}
              >
                <div className="h-32 md:h-40 bg-gradient-to-br from-green-100 to-emerald-100 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                    <FiStar className="text-yellow-500 text-xs" />
                    <span className="text-xs font-medium">
                      {service.provider.rating || 4.5}
                    </span>
                  </div>
                  {service.distance && (
                    <div className="absolute top-2 left-2 bg-blue-500/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <FiMapPin className="text-white text-xs" />
                      <span className="text-xs font-medium text-white">
                        {service.distance.toFixed(1)} km
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-3 text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FiClock className="text-xs" />
                      <span>{service.duration}</span>
                    </div>
                    <div className="text-gray-500">
                      {service.provider.reviewCount || 0} reviews
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-lg md:text-xl font-bold text-green-600">
                      ₹{service.price}
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
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 md:px-4 py-2 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium text-sm"
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

        {/* Location Selection Modal */}
        <AnimatePresence>
          {showLocationSelection && selectedService && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowLocationSelection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Select Service Location
                    </h3>
                    <button
                      onClick={() => setShowLocationSelection(false)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 mb-4">
                      Where would you like to get{" "}
                      <strong>{selectedService.title}</strong> service?
                    </p>

                    {/* Current/Default Location */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <FiMapPin className="text-green-600 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            Your Saved Location
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {selectedServiceLocation?.address ||
                              clientProfile?.address ||
                              "Your default location"}
                          </p>
                          {selectedServiceLocation?.city && (
                            <p className="text-gray-500 text-xs mt-1">
                              {selectedServiceLocation.city},{" "}
                              {selectedServiceLocation.state}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={handleLocationConfirm}
                          disabled={bookingLoading}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {bookingLoading
                            ? "Searching..."
                            : "Use This Location"}
                        </button>
                      </div>
                    </div>

                    {/* Option for Different Location */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <FiMapPin className="text-gray-600" />
                        <h4 className="font-semibold text-gray-800">
                          Different Location
                        </h4>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        Need service at a different address? Choose how you want
                        to select it:
                      </p>

                      {/* Two options side by side */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* Option 1: Type Address */}
                        <button
                          onClick={() => {
                            setShowLocationSelection(false);
                            setShowLocationPicker(true);
                            setIsMapMode(false); // Set to address input mode
                            setPickerLocation(null);
                            setPickedAddress(null);
                          }}
                          className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
                        >
                          <div className="text-2xl mb-2">⌨️</div>
                          <span className="text-sm font-medium text-gray-700">
                            Type Address
                          </span>
                          <span className="text-xs text-gray-500 mt-1 text-center">
                            Enter street, area, city details
                          </span>
                        </button>

                        {/* Option 2: Pick from Map */}
                        <button
                          onClick={() => {
                            setShowLocationSelection(false);
                            setShowLocationPicker(true);
                            setIsMapMode(true); // Set to map mode
                            if (
                              clientProfile?.latitude &&
                              clientProfile?.longitude
                            ) {
                              setPickerLocation({
                                latitude: clientProfile.latitude,
                                longitude: clientProfile.longitude,
                              });
                            }
                          }}
                          className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-gray-400 transition-colors"
                        >
                          <div className="text-2xl mb-2">📍</div>
                          <span className="text-sm font-medium text-gray-700">
                            Pick on Map
                          </span>
                          <span className="text-xs text-gray-500 mt-1 text-center">
                            Click on map to select
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-blue-600 text-xs font-bold">
                          i
                        </span>
                      </div>
                      <div>
                        <p className="text-blue-800 text-sm">
                          We'll find the nearest providers within 10km of your
                          selected location.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Location Picker Modal */}
        <AnimatePresence>
          {showLocationPicker && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowLocationPicker(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">
                      Pick Service Location
                    </h3>
                    <button
                      onClick={() => setShowLocationPicker(false)}
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                    >
                      <FiX />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Map/Address Input Section */}
                    <div className="order-2 lg:order-1">
                      {/* Mode Toggle */}
                      <div className="mb-4 flex bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setIsMapMode(true)}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            isMapMode
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          📍 Map Picker
                        </button>
                        <button
                          onClick={() => setIsMapMode(false)}
                          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                            !isMapMode
                              ? "bg-white text-gray-900 shadow-sm"
                              : "text-gray-600 hover:text-gray-900"
                          }`}
                        >
                          ⌨️ Type Address
                        </button>
                      </div>

                      {/* Map Mode */}
                      {isMapMode && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Click on map to select location
                          </h4>

                          <div className="mb-4">
                            <MapView
                              latitude={
                                pickerLocation?.latitude ||
                                clientProfile?.latitude ||
                                28.6139
                              }
                              longitude={
                                pickerLocation?.longitude ||
                                clientProfile?.longitude ||
                                77.209
                              }
                              zoom={13}
                              height="400px"
                              onMapClick={handleMapLocationClick}
                              markers={
                                pickerLocation
                                  ? [
                                      {
                                        lat: pickerLocation.latitude,
                                        lon: pickerLocation.longitude,
                                        label: "Selected Location",
                                        color: "#10B981",
                                      },
                                    ]
                                  : []
                              }
                            />
                          </div>
                        </>
                      )}

                      {/* Address Input Mode */}
                      {!isMapMode && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 mb-4">
                            Enter your address details
                          </h4>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                House/Building Number & Street *
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., 123, MG Road"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                onChange={(e) => {
                                  const currentAddress = pickedAddress || {
                                    address: "",
                                    city: "",
                                    state: "",
                                    country: "India",
                                  };
                                  setPickedAddress({
                                    ...currentAddress,
                                    address:
                                      e.target.value +
                                      (currentAddress.city
                                        ? `, ${currentAddress.city}`
                                        : ""),
                                  });
                                }}
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Area/Locality
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Sector 18"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  City *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Delhi"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  onChange={(e) => {
                                    const currentAddress = pickedAddress || {
                                      address: "",
                                      city: "",
                                      state: "",
                                      country: "India",
                                    };
                                    setPickedAddress({
                                      ...currentAddress,
                                      city: e.target.value,
                                    });

                                    // Set approximate coordinates for major cities
                                    const cityCoords: {
                                      [key: string]: [number, number];
                                    } = {
                                      delhi: [28.6139, 77.209],
                                      mumbai: [19.076, 72.8777],
                                      bangalore: [12.9716, 77.5946],
                                      pune: [18.5204, 73.8567],
                                      chennai: [13.0827, 80.2707],
                                      hyderabad: [17.385, 78.4867],
                                      kolkata: [22.5726, 88.3639],
                                    };

                                    const city = e.target.value.toLowerCase();
                                    const coords = cityCoords[city] || [
                                      28.6139, 77.209,
                                    ];

                                    setPickerLocation({
                                      latitude: coords[0],
                                      longitude: coords[1],
                                    });
                                  }}
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  State *
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., Delhi"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                  onChange={(e) => {
                                    const currentAddress = pickedAddress || {
                                      address: "",
                                      city: "",
                                      state: "",
                                      country: "India",
                                    };
                                    setPickedAddress({
                                      ...currentAddress,
                                      state: e.target.value,
                                    });
                                  }}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  PIN Code
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g., 110001"
                                  maxLength={6}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-blue-600 text-xs font-bold">
                              i
                            </span>
                          </div>
                          <div>
                            <p className="text-blue-800 text-sm">
                              {isMapMode
                                ? "Click anywhere on the map to select where you want the service. The address will be automatically detected."
                                : "Enter your complete address details. We'll use this to find nearby service providers."}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Details Section */}
                    <div className="order-1 lg:order-2">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        Selected Location
                      </h4>

                      {isLoadingAddress && (
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                          <span className="text-gray-600">
                            Getting address...
                          </span>
                        </div>
                      )}

                      {pickedAddress && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <FiMapPin className="text-green-600 mt-1" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-gray-800 mb-2">
                                Address Details
                              </h5>
                              <p className="text-gray-700 text-sm mb-2">
                                {pickedAddress.address}
                              </p>
                              {pickedAddress.city && (
                                <p className="text-gray-600 text-xs">
                                  {pickedAddress.city}, {pickedAddress.state}
                                </p>
                              )}
                              {pickerLocation && (
                                <p className="text-gray-500 text-xs mt-2">
                                  Coordinates:{" "}
                                  {pickerLocation.latitude.toFixed(4)},{" "}
                                  {pickerLocation.longitude.toFixed(4)}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {!pickerLocation && (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                          <p className="text-gray-600 text-center">
                            Click on the map to select a location
                          </p>
                        </div>
                      )}

                      {/* Quick Actions */}
                      <div className="space-y-3 mb-6">
                        <button
                          onClick={getCurrentLocation}
                          className="w-full px-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 hover:bg-blue-100 transition-colors flex items-center gap-3"
                        >
                          <FiMapPin />
                          <span>Use My Current Location</span>
                        </button>
                      </div>

                      {/* Confirm Button */}
                      {((isMapMode && pickerLocation && pickedAddress) ||
                        (!isMapMode && pickedAddress && pickerLocation)) && (
                        <button
                          onClick={handlePickedLocationConfirm}
                          className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          Confirm This Location
                        </button>
                      )}
                    </div>
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
                      {bookingLoading ? "Processing..." : "Continue to Payment"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && selectedService && selectedProvider && (
            <CreateBookingWithPayment
              service={selectedService}
              onClose={() => setShowPaymentModal(false)}
              onSuccess={handlePaymentSuccess}
              preSelectedBookingData={{
                providerId: selectedProvider.id,
                providerName:
                  selectedProvider.businessName || selectedProvider.name,
                date: selectedDate,
                time: selectedTime,
                notes: bookingNotes,
                clientAddress:
                  selectedServiceLocation?.address ||
                  clientProfile?.address ||
                  clientProfile?.city ||
                  "",
                clientLatitude:
                  selectedServiceLocation?.latitude || clientProfile?.latitude,
                clientLongitude:
                  selectedServiceLocation?.longitude ||
                  clientProfile?.longitude,
              }}
            />
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
