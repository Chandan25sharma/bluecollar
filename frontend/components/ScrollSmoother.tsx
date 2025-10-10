"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function ScrollSmootherComponent() {
  useEffect(() => {
    // Only run on client side and desktop
    if (typeof window !== "undefined" && window.innerWidth > 1024) {
      ScrollSmoother.create({
        smooth: 1,
        effects: true,
        smoothTouch: false,
        normalizeScroll: true,
        ignoreMobileResize: true,
      });
    }
  }, []);

  return null;
}

// Utility function for pinning content
export const hasPinContent = (
  element: HTMLElement,
  start = "bottom bottom",
  dWidth = 1023
) => {
  if (typeof window === "undefined") return;

  let device_width = window.innerWidth;
  if (element && device_width > dWidth) {
    return gsap.to(element, {
      scrollTrigger: {
        trigger: element,
        pin: true,
        scrub: true,
        pinSpacing: false,
        start: start,
        end: "bottom -=500",
      },
    });
  }
};

// Alternative pin function with custom area
export const hasPinContent2 = (
  element: HTMLElement,
  area: HTMLElement,
  start = "top top",
  dWidth = 991
) => {
  if (typeof window === "undefined") return;

  let device_width = window.innerWidth;
  if (element && device_width > dWidth) {
    return gsap.to(element, {
      scrollTrigger: {
        trigger: area,
        pin: element,
        start: start,
        end: "bottom bottom",
        pinSpacing: false,
      },
    });
  }
};

// Fade animation utility
export const hasFadeAnim = (elements?: string) => {
  const items = elements
    ? document.querySelectorAll(elements)
    : document.querySelectorAll("[data-fade-anim]");

  items.forEach((item) => {
    gsap.fromTo(
      item,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      }
    );
  });
};
