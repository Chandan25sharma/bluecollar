// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import { FiExternalLink } from "react-icons/fi";

interface MapViewProps {
  latitude: number;
  longitude: number;
  zoom?: number;
  height?: string;
  width?: string;
  className?: string;
  showControls?: boolean;
  markers?: Array<{
    lat: number;
    lon: number;
    label?: string;
    color?: string;
  }>;
  onMapClick?: (lat: number, lon: number) => void;
}

export default function MapView({
  latitude,
  longitude,
  zoom = 15,
  height = "300px",
  width = "100%",
  className = "",
  showControls = true,
  markers = [],
  onMapClick,
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet only on client side
    const loadMap = async () => {
      if (typeof window === "undefined") return;

      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // Use custom markers without requiring image files
        L.Icon.Default.mergeOptions({
          iconUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
              <path fill="#3B82F6" stroke="#1E40AF" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 4.4 2.4 9.7 12.5 28.5 10.1-18.8 12.5-24.1 12.5-28.5C25 5.6 19.4 0 12.5 0z"/>
              <circle fill="white" cx="12.5" cy="12.5" r="6"/>
            </svg>
          `),
          iconRetinaUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="82" viewBox="0 0 50 82">
              <path fill="#3B82F6" stroke="#1E40AF" stroke-width="4" d="M25 0C11.2 0 0 11.2 0 25c0 8.8 4.8 19.4 25 57 20.2-37.6 25-48.2 25-57C50 11.2 38.8 0 25 0z"/>
              <circle fill="white" cx="25" cy="25" r="12"/>
            </svg>
          `),
          shadowUrl:
            "data:image/svg+xml;base64," +
            btoa(`
            <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41">
              <ellipse fill="rgba(0,0,0,0.3)" cx="20.5" cy="20.5" rx="15" ry="8"/>
            </svg>
          `),
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        if (mapRef.current) {
          // Remove existing map
          if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
          }

          // Create new map
          const map = L.map(mapRef.current).setView(
            [latitude, longitude],
            zoom
          );

          // Add OpenStreetMap tiles
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Add main marker
          const mainMarker = L.marker([latitude, longitude])
            .addTo(map)
            .bindPopup("Your Location");

          // Add additional markers
          markers.forEach((marker) => {
            let markerInstance;

            if (marker.color) {
              const markerIcon = L.divIcon({
                html: `<div style="background-color: ${marker.color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
                className: "custom-marker",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              });
              markerInstance = L.marker([marker.lat, marker.lon], {
                icon: markerIcon,
              });
            } else {
              markerInstance = L.marker([marker.lat, marker.lon]);
            }

            markerInstance.addTo(map);

            if (marker.label) {
              markerInstance.bindPopup(marker.label);
            }
          });

          // Handle map clicks
          if (onMapClick) {
            map.on("click", (e: any) => {
              onMapClick(e.latlng.lat, e.latlng.lng);
            });
          }

          // Disable scroll wheel zoom if controls are disabled
          if (!showControls) {
            map.scrollWheelZoom.disable();
            map.doubleClickZoom.disable();
            map.touchZoom.disable();
            map.boxZoom.disable();
            map.keyboard.disable();
            // Disable tap handler if it exists (mobile)
            if ("tap" in map && map.tap) {
              (map as any).tap.disable();
            }
          }

          mapInstanceRef.current = map;
        }
      } catch (error) {
        console.error("Error loading map:", error);
      }
    };

    loadMap();

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, zoom, markers, onMapClick, showControls]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, "_blank");
  };

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        style={{ height, width }}
        className="rounded-lg overflow-hidden border border-gray-200"
      />

      {/* External link button */}
      <button
        onClick={openInGoogleMaps}
        className="absolute top-2 right-2 bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200"
        title="Open in Google Maps"
      >
        <FiExternalLink size={16} className="text-gray-600" />
      </button>
    </div>
  );
}
