"use client";

import { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ServicesCTASection from "../../components/services/ServicesCTASection";
import ServicesScrollSection from "../../components/services/ServicesScrollSection";
import ServicesHeroSection from "../../components/services/ServicesHeroSection";
import ServicesSearchSection from "../../components/services/ServicesSearchSection";
import { servicesAPI } from "../../lib/api";

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  duration: string;
  isActive: boolean;
  provider?: {
    id: string;
    businessName: string;
  };
}

export default function ServicesShowcasePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getServices();
      const activeServices = response.data.filter((s: Service) => s.isActive);
      setServices(activeServices);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: "all", name: "All Services", icon: "🏠", count: services.length },
    {
      id: "Electrical",
      name: "Electrical",
      icon: "⚡",
      count: services.filter((s) => s.category === "Electrical").length,
    },
    {
      id: "Plumbing",
      name: "Plumbing",
      icon: "🚰",
      count: services.filter((s) => s.category === "Plumbing").length,
    },
    {
      id: "Cleaning",
      name: "Cleaning",
      icon: "🧹",
      count: services.filter((s) => s.category === "Cleaning").length,
    },
    {
      id: "Carpentry",
      name: "Carpentry",
      icon: "🛠️",
      count: services.filter((s) => s.category === "Carpentry").length,
    },
    {
      id: "HVAC",
      name: "HVAC",
      icon: "❄️",
      count: services.filter((s) => s.category === "HVAC").length,
    },
    {
      id: "Painting",
      name: "Painting",
      icon: "🎨",
      count: services.filter((s) => s.category === "Painting").length,
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />

      {/* Hero Section */}
      <ServicesHeroSection />

      {/* Search & Filter Section */}
      <ServicesSearchSection
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Services Scroll Section */}
      <ServicesScrollSection
        services={filteredServices}
        loading={loading}
        selectedCategory={selectedCategory}
        categories={categories}
      />

      {/* CTA Section */}
      <ServicesCTASection />

      <Footer />
    </div>
  );
}
