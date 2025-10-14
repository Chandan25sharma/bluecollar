// OpenStreetMap utilities for location services
export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  display_name: string;
}

export interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    house_number?: string;
    road?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

// Nominatim API base URL
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Rate limiting - Nominatim allows 1 request per second
const requestQueue: (() => Promise<any>)[] = [];
let isProcessing = false;

const processQueue = async () => {
  if (isProcessing || requestQueue.length === 0) return;
  
  isProcessing = true;
  const request = requestQueue.shift();
  if (request) {
    await request();
    // Wait 1 second between requests
    setTimeout(() => {
      isProcessing = false;
      processQueue();
    }, 1000);
  }
};

const queueRequest = <T>(request: () => Promise<T>): Promise<T> => {
  return new Promise((resolve, reject) => {
    requestQueue.push(async () => {
      try {
        const result = await request();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
    processQueue();
  });
};

// Geocoding: Address to Coordinates
export const geocodeAddress = async (address: string): Promise<LocationData | null> => {
  return queueRequest(async () => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?` + new URLSearchParams({
          q: address,
          format: 'json',
          limit: '1',
          addressdetails: '1',
        }),
        {
          headers: {
            'User-Agent': 'BlueCollar-App/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResponse[] = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        return {
          address: result.address?.road ? 
            `${result.address.house_number || ''} ${result.address.road}`.trim() : 
            address,
          city: result.address?.city || '',
          state: result.address?.state || '',
          country: result.address?.country || '',
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          display_name: result.display_name,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  });
};

// Reverse Geocoding: Coordinates to Address
export const reverseGeocode = async (lat: number, lon: number): Promise<LocationData | null> => {
  return queueRequest(async () => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?` + new URLSearchParams({
          lat: lat.toString(),
          lon: lon.toString(),
          format: 'json',
          addressdetails: '1',
        }),
        {
          headers: {
            'User-Agent': 'BlueCollar-App/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: NominatimResponse = await response.json();
      
      return {
        address: result.address?.road ? 
          `${result.address.house_number || ''} ${result.address.road}`.trim() : 
          result.display_name.split(',')[0],
        city: result.address?.city || '',
        state: result.address?.state || '',
        country: result.address?.country || '',
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        display_name: result.display_name,
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return null;
    }
  });
};

// Get current location using browser API
export const getCurrentLocation = (): Promise<LocationCoordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  });
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Format distance for display
export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

// Open location in Google Maps
export const openInGoogleMaps = (address: string): void => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  window.open(url, '_blank');
};

// Open coordinates in Google Maps
export const openCoordinatesInGoogleMaps = (lat: number, lon: number): void => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
  window.open(url, '_blank');
};

// Validate coordinates
export const isValidCoordinates = (lat: number, lon: number): boolean => {
  return (
    lat >= -90 && 
    lat <= 90 && 
    lon >= -180 && 
    lon <= 180 &&
    !isNaN(lat) && 
    !isNaN(lon)
  );
};

// Format address for display
export const formatAddress = (location: Partial<LocationData>): string => {
  const parts = [];
  
  if (location.address) parts.push(location.address);
  if (location.city) parts.push(location.city);
  if (location.state) parts.push(location.state);
  if (location.country && location.country !== 'India') parts.push(location.country);
  
  return parts.join(', ');
};

// Get address suggestions as user types
export const getAddressSuggestions = async (query: string): Promise<LocationData[]> => {
  if (query.length < 3) return [];
  
  return queueRequest(async () => {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/search?` + new URLSearchParams({
          q: query,
          format: 'json',
          limit: '5',
          addressdetails: '1',
          countrycodes: 'in,np', // Focus on India and Nepal
        }),
        {
          headers: {
            'User-Agent': 'BlueCollar-App/1.0',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NominatimResponse[] = await response.json();
      
      return data.map((result) => ({
        address: result.address?.road ? 
          `${result.address.house_number || ''} ${result.address.road}`.trim() : 
          result.display_name.split(',')[0],
        city: result.address?.city || '',
        state: result.address?.state || '',
        country: result.address?.country || '',
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        display_name: result.display_name,
      }));
    } catch (error) {
      console.error('Address suggestions error:', error);
      return [];
    }
  });
};