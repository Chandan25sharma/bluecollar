"use client";

import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/landing/Header";
import HeroSection from "../components/landing/HeroSection";
import ServicesCarousel from "../components/landing/ServicesCarousel";
import ServicesGallery from "../components/landing/ServicesGallery";
import { servicesAPI } from "../lib/api";

export default function LandingPage() {
  const [providersCount, setProvidersCount] = useState<number>(50);
  const [servicesCount, setServicesCount] = useState<number>(100);

  useEffect(() => {
    // Fetch counts for dynamic stats
    const fetchCounts = async () => {
      try {
        const servicesRes = await servicesAPI.getServices();

        if (servicesRes.data) {
          setServicesCount(servicesRes.data.length || 100);
        }
      } catch (error) {
        console.log("Using default counts due to API error:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header with green theme */}
      <Header />

      {/* Hero Section with green theme */}
      <HeroSection
        providersCount={providersCount}
        servicesCount={servicesCount}
      />

      {/* Auto-scrolling Services Carousel */}
      <ServicesCarousel />

      {/* Services Gallery */}
      <ServicesGallery />

      {/* Footer */}
      <Footer />
    </div>
  );
}
