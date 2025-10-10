"use client";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ScrollSmootherComponent from "../components/ScrollSmoother";
import CTASection from "../components/landing/CTASection";
import FeaturesSection from "../components/landing/FeaturesSection";
import HeroSection from "../components/landing/HeroSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import ServicesSection from "../components/landing/ServicesSection";
import StatsSection from "../components/landing/StatsSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <ScrollSmootherComponent />
      <Header />

      {/* Main Content with Smooth Scrolling */}
      <main id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
          <ServicesSection />
          <HowItWorksSection />
          <TestimonialsSection />
          <CTASection />
        </div>
      </main>

      <Footer />
    </div>
  );
}
