"use client";

import { useEffect, useRef, useState } from "react";
import { FiLoader, FiMapPin, FiNavigation } from "react-icons/fi";
import {
  geocodeAddress,
  getAddressSuggestions,
  getCurrentLocation,
  LocationData,
  reverseGeocode,
} from "../lib/location";

interface LocationPickerProps {
  onLocationSelect: (location: LocationData) => void;
  defaultLocation?: LocationData | null;
  placeholder?: string;
  className?: string;
  required?: boolean;
  showCurrentLocationButton?: boolean;
}

export default function LocationPicker({
  onLocationSelect,
  defaultLocation,
  placeholder = "Enter your address",
  className = "",
  required = false,
  showCurrentLocationButton = true,
}: LocationPickerProps) {
  const [query, setQuery] = useState(defaultLocation?.display_name || "");
  const [suggestions, setSuggestions] = useState<LocationData[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLocationLoading, setCurrentLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    defaultLocation || null
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Handle input change with debouncing
  const handleInputChange = async (value: string) => {
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getAddressSuggestions(value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setQuery(location.display_name);
    setShowSuggestions(false);
    onLocationSelect(location);
  };

  // Handle manual address entry (when user presses Enter)
  const handleManualEntry = async () => {
    if (query.length < 3) return;

    setLoading(true);
    try {
      const location = await geocodeAddress(query);
      if (location) {
        handleSuggestionSelect(location);
      }
    } catch (error) {
      console.error("Error geocoding address:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get current location
  const getCurrentLocationHandler = async () => {
    setCurrentLocationLoading(true);
    try {
      const coords = await getCurrentLocation();
      const location = await reverseGeocode(coords.latitude, coords.longitude);

      if (location) {
        handleSuggestionSelect(location);
      }
    } catch (error) {
      console.error("Error getting current location:", error);
      alert(
        "Unable to get your current location. Please enter your address manually."
      );
    } finally {
      setCurrentLocationLoading(false);
    }
  };

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length > 0 && showSuggestions) {
        handleSuggestionSelect(suggestions[0]);
      } else {
        handleManualEntry();
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="relative">
          <FiMapPin
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder={placeholder}
            required={required}
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {loading && (
            <FiLoader
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin"
              size={18}
            />
          )}
        </div>

        {showCurrentLocationButton && (
          <button
            type="button"
            onClick={getCurrentLocationHandler}
            disabled={currentLocationLoading}
            className="mt-2 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {currentLocationLoading ? (
              <FiLoader className="animate-spin" size={14} />
            ) : (
              <FiNavigation size={14} />
            )}
            Use Current Location
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionSelect(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-3">
                <FiMapPin
                  className="text-gray-400 mt-0.5 flex-shrink-0"
                  size={16}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {suggestion.address ||
                      suggestion.display_name.split(",")[0]}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {suggestion.city && suggestion.state
                      ? `${suggestion.city}, ${suggestion.state}`
                      : suggestion.display_name}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiMapPin className="text-green-600 mt-0.5" size={16} />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Selected Location:
              </p>
              <p className="text-sm text-green-700">
                {selectedLocation.display_name}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Lat: {selectedLocation.latitude.toFixed(6)}, Lon:{" "}
                {selectedLocation.longitude.toFixed(6)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
