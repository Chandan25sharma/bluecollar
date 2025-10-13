"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  FiChevronDown,
  FiClock,
  FiEdit,
  FiGrid,
  FiPlus,
  FiSearch,
  FiToggleLeft,
  FiToggleRight,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import ProviderHeader from "../../../../components/ProviderHeader";

interface Service {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  duration: string;
  isActive: boolean;
  createdAt: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export default function ProviderServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      title: "Basic Plumbing Repair",
      price: 75,
      description:
        "Fix leaks, clogged drains, and pipe repairs. Includes basic parts and labor.",
      category: "plumbing",
      duration: "1-2 hours",
      isActive: true,
      createdAt: "2023-09-15",
    },
    {
      id: "2",
      title: "Electrical Installation",
      price: 120,
      description:
        "Light fixture installation, outlet replacement, and basic electrical work.",
      category: "electrical",
      duration: "2-3 hours",
      isActive: true,
      createdAt: "2023-10-01",
    },
    {
      id: "3",
      title: "Advanced HVAC Service",
      price: 150,
      description:
        "AC maintenance, heating system check, and HVAC troubleshooting.",
      category: "hvac",
      duration: "3-4 hours",
      isActive: false,
      createdAt: "2023-10-10",
    },
  ]);

  const [newService, setNewService] = useState({
    title: "",
    price: 0,
    description: "",
    category: "",
    duration: "1 hour",
    isActive: true,
  });

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileForm, setShowMobileForm] = useState(false);

  const categories: ServiceCategory[] = [
    { id: "plumbing", name: "Plumbing", icon: "" },
    { id: "electrical", name: "Electrical", icon: "" },
    { id: "hvac", name: "HVAC", icon: "❄️" },
    { id: "carpentry", name: "Carpentry", icon: "" },
    { id: "cleaning", name: "Cleaning", icon: "" },
    { id: "painting", name: "Painting", icon: "" },
    { id: "other", name: "Other", icon: "🔧" },
  ];

  const durationOptions = [
    "30 minutes",
    "1 hour",
    "1-2 hours",
    "2-3 hours",
    "3-4 hours",
    "4+ hours",
    "Full day",
  ];

  useEffect(() => {
    // Close mobile form when switching to edit mode
    if (isEditing && window.innerWidth < 1024) {
      setShowMobileForm(true);
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editingService) {
      // Update existing service
      setServices(
        services.map((service) =>
          service.id === editingService.id
            ? { ...service, ...newService }
            : service
        )
      );
      setIsEditing(false);
      setEditingService(null);
    } else {
      // Add new service
      const newServiceObj: Service = {
        id: String(Date.now()),
        ...newService,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setServices([...services, newServiceObj]);
    }

    setNewService({
      title: "",
      price: 0,
      description: "",
      category: "",
      duration: "1 hour",
      isActive: true,
    });

    // Close mobile form after submission
    if (window.innerWidth < 1024) {
      setShowMobileForm(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setNewService({
      title: service.title,
      price: service.price,
      description: service.description,
      category: service.category,
      duration: service.duration,
      isActive: service.isActive,
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingService(null);
    setNewService({
      title: "",
      price: 0,
      description: "",
      category: "",
      duration: "1 hour",
      isActive: true,
    });

    // Close mobile form
    if (window.innerWidth < 1024) {
      setShowMobileForm(false);
    }
  };

  const toggleServiceStatus = (id: string) => {
    setServices(
      services.map((service) =>
        service.id === id
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
  };

  const filteredServices = services.filter((service) => {
    // Filter by tab
    if (activeTab === "active" && !service.isActive) return false;
    if (activeTab === "inactive" && service.isActive) return false;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "Uncategorized";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.icon : "🔧";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // ServiceForm Component
  const ServiceForm = () => {
    const handleChange = (field: string, value: any) => {
      setNewService((prev) => ({ ...prev, [field]: value }));
    };

    return (
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:sticky lg:top-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {isEditing ? "Edit Service" : "Add New Service"}
            </h2>
            <button
              onClick={handleCancelEdit}
              className="lg:hidden text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Service Title */}
            <input
              type="text"
              value={newService.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="e.g., Basic Plumbing Repair"
              required
              className="w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>

              {/* Mobile dropdown */}
              <div className="sm:hidden relative">
                <select
                  value={newService.category}
                  onChange={(e) => handleChange("category", e.target.value)}
                  className="w-full border border-gray-300 rounded-xl py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all hover:border-gray-400"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <FiChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>

              {/* Desktop pills */}
              <div className="hidden sm:flex gap-3 overflow-x-auto py-1">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleChange("category", category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm whitespace-nowrap transition-all duration-200 ${
                      newService.category === category.id
                        ? "border-green-500 bg-green-50 text-green-700 shadow-sm"
                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={newService.price}
                  onChange={(e) =>
                    handleChange("price", Number(e.target.value))
                  }
                  placeholder="0.00"
                  required
                  className="w-full border border-gray-300 rounded-xl py-2 pl-8 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Duration
              </label>
              <select
                value={newService.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                required
                className="w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={4}
                value={newService.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe what this service includes..."
                required
                className="w-full border border-gray-300 rounded-xl py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Active toggle */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleChange("isActive", !newService.isActive)}
                className="relative inline-flex items-center mr-3"
              >
                {newService.isActive ? (
                  <FiToggleRight className="h-6 w-6 text-green-500" />
                ) : (
                  <FiToggleLeft className="h-6 w-6 text-gray-400" />
                )}
              </button>
              <label className="text-sm text-gray-900">
                Active (visible to customers)
              </label>
            </div>

            {/* Action buttons */}
            <div className="flex space-x-3 pt-4">
              {isEditing && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-green-600 to-teal-500 text-white py-2 rounded-xl font-medium hover:shadow-md transition-all"
              >
                {isEditing ? "Update Service" : "Add Service"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  };

  const handleDelete = (id: string): void => {
    // Remove service from the array
    setServices(services.filter((service) => service.id !== id));

    // If we're currently editing this service, cancel the edit
    if (editingService && editingService.id === id) {
      handleCancelEdit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-8xl mx-auto px-0 sm:px-0 lg:px-0 py-0">
        {/* Header */}
        <ProviderHeader />
        {/* Page Title and Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            {/* Active count & New Service button */}
            <div className="flex items-center justify-between w-full md:w-auto">
              <span className="text-sm text-gray-500">
                {services.filter((s) => s.isActive).length} active services
              </span>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingService(null);
                  setNewService({
                    title: "",
                    price: 0,
                    description: "",
                    category: "",
                    duration: "1 hour",
                    isActive: true,
                  });
                  setShowMobileForm(true);
                }}
                className="bg-gradient-to-r from-green-600 to-teal-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-medium hover:shadow-md transition-all flex items-center text-sm sm:text-base"
              >
                <FiPlus className="mr-1 sm:mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                New Service
              </button>
            </div>
          </div>

          {/* Stats Bars */}
          <div className="space-y-0 mt-2 sm:mt-6">
            {[
              { label: "Total Services", value: services.length },
              {
                label: "Active Services",
                value: services.filter((s) => s.isActive).length,
              },
              {
                label: "Average Price",
                value: formatCurrency(
                  services.reduce((sum, s) => sum + s.price, 0) /
                    services.length || 0
                ),
              },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 flex justify-between items-center hover:shadow-md transition-all text-sm sm:text-base"
              >
                <span className="text-gray-600">{stat.label}</span>
                <span className="font-semibold text-gray-900">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Services List */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-2 sm:p-6 mb-3 border border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1 max-w-full sm:max-w-md">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <FiSearch className="text-gray-400 text-sm sm:text-base" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 sm:py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base transition-all"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-0">
                  {[
                    {
                      label: "All",
                      key: "all",
                      count: services.length,
                      color: "green",
                    },
                    {
                      label: "Active",
                      key: "active",
                      count: services.filter((s) => s.isActive).length,
                      color: "green",
                    },
                    {
                      label: "Inactive",
                      key: "inactive",
                      count: services.filter((s) => !s.isActive).length,
                      color: "yellow",
                    },
                  ].map((tab) => {
                    const isActive = activeTab === tab.key;
                    return (
                      <button
                        key={tab.key}
                        onClick={() =>
                          setActiveTab(tab.key as "all" | "active" | "inactive")
                        }
                        className={`
              px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base font-medium rounded-full transition-all
              ${
                isActive
                  ? `bg-${tab.color}-100 text-${tab.color}-700 shadow`
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
                      >
                        {tab.label} ({tab.count})
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Services Grid */}
            {filteredServices.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-10 text-center border border-gray-100">
                <div className="bg-gradient-to-br from-green-50 to-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                  <FiGrid className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  No services found
                </h3>
                <p className="mt-2 text-gray-500">
                  {searchQuery
                    ? "No services match your search criteria."
                    : activeTab === "all"
                    ? "You haven't created any services yet."
                    : `You don't have any ${activeTab} services.`}
                </p>
                {!searchQuery && activeTab === "all" && (
                  <button
                    onClick={() => setShowMobileForm(true)}
                    className="mt-4 text-green-600 hover:text-green-800 font-medium text-sm"
                  >
                    Create your first service
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                {filteredServices.map((service) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center">
                        <h3 className="text-lg font-semibold  text-gray-900">
                          {service.title}
                        </h3>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          service.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {service.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-2 text-sm">
                      {service.description}
                    </p>

                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center text-sm text-gray-500">
                        <FiClock className="mr-1 h-4 w-4" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrency(service.price)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Added {formatDate(service.createdAt)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(service)}
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit service"
                        >
                          <FiEdit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => toggleServiceStatus(service.id)}
                          className="p-2 text-gray-400 hover:text-yellow-600 transition-colors"
                          title={service.isActive ? "Deactivate" : "Activate"}
                        >
                          {service.isActive ? (
                            <FiToggleRight className="h-4 w-4" />
                          ) : (
                            <FiToggleLeft className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete service"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Service Form (Desktop) */}
          <div className="lg:w-96">
            <div className="hidden lg:block">
              <ServiceForm />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Form Overlay */}
      <AnimatePresence>
        {showMobileForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <ServiceForm />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
