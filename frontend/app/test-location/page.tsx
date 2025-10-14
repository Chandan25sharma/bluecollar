"use client";

import { useState } from "react";
import { FiCheck, FiMapPin, FiNavigation } from "react-icons/fi";
import LocationPicker from "../../components/LocationPicker";
import MapView from "../../components/MapView";
import {
  LocationData,
  getCurrentLocation,
  openInGoogleMaps,
} from "../../lib/location";

export default function LocationTestPage() {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  );
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const coords = await getCurrentLocation();
      setCurrentLocation({ lat: coords.latitude, lon: coords.longitude });
    } catch (error) {
      alert("Could not get your current location: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const mockProviders = [
    {
      lat: 27.7172,
      lon: 85.324,
      label: "Provider 1 - Electrician",
      color: "#3B82F6",
    },
    {
      lat: 27.7089,
      lon: 85.3267,
      label: "Provider 2 - Plumber",
      color: "#EF4444",
    },
    {
      lat: 27.7019,
      lon: 85.3206,
      label: "Provider 3 - Cleaner",
      color: "#10B981",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            OpenStreetMap Location Demo
          </h1>
          <p className="text-gray-600">
            Test location selection, geocoding, and map display functionality
            for BlueCollar platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Selection */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="text-blue-600" />
              Location Selection
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search for Address
                </label>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  placeholder="Try searching for 'Kathmandu', 'Thamel', 'Durbar Square', etc."
                  showCurrentLocationButton
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiNavigation size={16} />
                  )}
                  Get Current Location
                </button>

                {selectedLocation && (
                  <button
                    onClick={() =>
                      openInGoogleMaps(selectedLocation.display_name)
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <FiCheck size={16} />
                    Open in Google Maps
                  </button>
                )}
              </div>

              {selectedLocation && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="font-medium text-green-800 mb-2">
                    Selected Location:
                  </h3>
                  <p className="text-sm text-green-700">
                    {selectedLocation.display_name}
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Coordinates: {selectedLocation.latitude.toFixed(6)},{" "}
                    {selectedLocation.longitude.toFixed(6)}
                  </p>
                </div>
              )}

              {currentLocation && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Current Location:
                  </h3>
                  <p className="text-xs text-blue-600">
                    Coordinates: {currentLocation.lat.toFixed(6)},{" "}
                    {currentLocation.lon.toFixed(6)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Map Display */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiMapPin className="text-green-600" />
              Map Display
            </h2>

            {selectedLocation || currentLocation ? (
              <div className="space-y-4">
                <MapView
                  latitude={selectedLocation?.latitude || currentLocation!.lat}
                  longitude={
                    selectedLocation?.longitude || currentLocation!.lon
                  }
                  zoom={14}
                  height="400px"
                  markers={[
                    ...mockProviders,
                    ...(selectedLocation
                      ? [
                          {
                            lat: selectedLocation.latitude,
                            lon: selectedLocation.longitude,
                            label: "Selected Location",
                            color: "#DC2626",
                          },
                        ]
                      : []),
                    ...(currentLocation && !selectedLocation
                      ? [
                          {
                            lat: currentLocation.lat,
                            lon: currentLocation.lon,
                            label: "Your Location",
                            color: "#7C3AED",
                          },
                        ]
                      : []),
                  ]}
                />
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-2">Legend:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                      <span>Selected Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                      <span>Current Location</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      <span>Available Providers</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">
                  Select a location to see it on the map
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features Demo */}
        <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            OpenStreetMap Integration Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiMapPin className="text-blue-600" size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Address Search</h3>
              <p className="text-sm text-gray-600">
                Search for addresses in India, Nepal, and worldwide using
                OpenStreetMap's Nominatim API
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiNavigation className="text-green-600" size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Current Location
              </h3>
              <p className="text-sm text-gray-600">
                Get user's current location using browser geolocation API with
                proper error handling
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FiCheck className="text-purple-600" size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-2">
                Provider Matching
              </h3>
              <p className="text-sm text-gray-600">
                Calculate distances and show nearby service providers on
                interactive maps
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2">
              Implementation Notes:
            </h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>
                • Uses Nominatim API with rate limiting (1 request/second)
              </li>
              <li>
                • Supports both India and Nepal with country code filtering
              </li>
              <li>• Interactive maps powered by Leaflet.js</li>
              <li>• Calculates distances using Haversine formula</li>
              <li>• Integrates with Google Maps for navigation</li>
              <li>• Stores coordinates for booking location tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
