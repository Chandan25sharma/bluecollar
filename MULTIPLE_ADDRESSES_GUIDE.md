# Multiple Addresses & Location Features - Implementation Guide

## 🎯 What's Been Implemented (Backend)

### 1. Database Schema Updates

#### New Model: `ClientAddress`

```prisma
model ClientAddress {
  id             String        @id @default(auto()) @map("_id") @db.ObjectId
  label          String        // e.g., "Home", "Office", "Parents House"
  address        String        // Full address from Google Maps
  latitude       Float
  longitude      Float
  city           String?
  state          String?
  zipCode        String?
  isDefault      Boolean       @default(false)
  client         ClientProfile @relation(fields: [clientId], references: [id], onDelete: Cascade)
  clientId       String        @db.ObjectId
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt
}
```

#### Updated `Booking` Model

Now stores the client's address used for each booking:

```prisma
model Booking {
  // ... existing fields
  clientAddress   String?  // Address used for this booking
  clientLatitude  Float?
  clientLongitude Float?
  distance        Float?   // Calculated distance to provider
}
```

#### Updated `ProviderProfile` Model

Providers can now add their location:

```prisma
model ProviderProfile {
  // ... existing fields
  address   String?
  latitude  Float?
  longitude Float?
  city      String?
  state     String?
  zipCode   String?
}
```

### 2. New API Endpoints

#### Address Management (`/api/addresses`)

- `GET /api/addresses` - Get all saved addresses for logged-in client
- `POST /api/addresses` - Create new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address
- `PUT /api/addresses/:id/set-default` - Set as default address

#### Services

- `GET /api/services/nearby?latitude=X&longitude=Y&category=X&maxDistance=50` - Get services by nearest providers

### 3. Updated Booking Flow

When creating a booking, you can now send:

```json
{
  "serviceId": "...",
  "providerId": "...", // Optional: specific provider
  "date": "2025-10-10T14:00:00Z",
  "notes": "Please call before arriving",
  "clientAddress": "123 Main St, New York, NY 10001",
  "clientLatitude": 40.7589,
  "clientLongitude": -73.9851
}
```

The system will:

- Calculate distance between client and provider
- Store the address used for this booking
- Provider can see client's location when reviewing request

---

## 📋 Frontend Implementation Tasks

### Phase 1: Address Management for Clients

#### 1.1 Create Address Management Component

Location: `frontend/components/AddressManager.tsx`

Features:

- List all saved addresses
- Add new address with Google Maps Autocomplete
- Edit/Delete addresses
- Set default address
- Visual indicators for default address

#### 1.2 Integrate Google Maps API

1. Get Google Maps API Key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable APIs:

   - Maps JavaScript API
   - Places API
   - Geocoding API

3. Add to `frontend/.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

4. Install package:

```bash
npm install @googlemaps/js-api-loader
```

#### 1.3 Update Client Dashboard

Add "Manage Addresses" section:

- Tab or modal to manage addresses
- Address selector when booking
- Display default address prominently

### Phase 2: Provider Location Setup

#### 2.1 Provider Signup/Profile

Add Google Maps location picker:

- Address autocomplete
- Draggable map marker for exact location
- Save coordinates with profile

#### 2.2 Update Provider Dashboard

Show booking requests with client details:

```
┌─────────────────────────────────────────┐
│ New Booking Request                      │
├─────────────────────────────────────────┤
│ Service: Emergency Plumbing              │
│ Client: John Doe                         │
│ Phone: +1234567890                       │
│                                          │
│ 📍 Service Location:                     │
│ 123 Main St, New York, NY 10001         │
│ Distance: 5.2 km away                    │
│ [View on Map]                            │
│                                          │
│ Date: Oct 10, 2025 at 2:00 PM           │
│ Notes: Please call before arriving       │
│                                          │
│ [Accept] [Reject]                        │
└─────────────────────────────────────────┘
```

### Phase 3: Enhanced Booking Flow

#### 3.1 Update Booking Page

When client clicks "Book Now" on a service:

1. **Step 1: Select/Confirm Address**

   - Show saved addresses
   - Option to add new address
   - Display on map

2. **Step 2: Select Provider** (if multiple nearby)

   - List providers sorted by distance
   - Show each provider's:
     - Name, rating, distance
     - Location on map
     - Availability

3. **Step 3: Choose Date/Time**

   - Calendar picker
   - Time slots

4. **Step 4: Confirm & Submit**
   - Review all details
   - Submit booking request

---

## 🔧 Frontend Code Examples

### Example: Address Selector Component

```typescript
// frontend/components/AddressSelector.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Address {
  id: string;
  label: string;
  address: string;
  latitude: number;
  longitude: number;
  isDefault: boolean;
}

export default function AddressSelector({
  onSelect,
}: {
  onSelect: (address: Address) => void;
}) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    const { data } = await axios.get("http://localhost:4001/api/addresses", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setAddresses(data);

    // Auto-select default
    const defaultAddr = data.find((a: Address) => a.isDefault);
    if (defaultAddr) {
      setSelected(defaultAddr.id);
      onSelect(defaultAddr);
    }
  };

  const handleSelect = (address: Address) => {
    setSelected(address.id);
    onSelect(address);
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">Select Service Location</h3>
      {addresses.map((addr) => (
        <div
          key={addr.id}
          onClick={() => handleSelect(addr)}
          className={`p-4 border rounded-lg cursor-pointer transition-all ${
            selected === addr.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold flex items-center gap-2">
                {addr.label}
                {addr.isDefault && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600">{addr.address}</div>
            </div>
            <input
              type="radio"
              checked={selected === addr.id}
              onChange={() => {}}
              className="w-5 h-5"
            />
          </div>
        </div>
      ))}
      <button className="text-blue-600 hover:text-blue-700 font-medium">
        + Add New Address
      </button>
    </div>
  );
}
```

### Example: Google Maps Autocomplete

```typescript
// frontend/components/AddressInput.tsx
"use client";
import { useEffect, useRef, useState } from "react";

export default function AddressInput({
  onAddressSelect,
}: {
  onAddressSelect: (address: any) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);

  useEffect(() => {
    if (!window.google) {
      // Load Google Maps script
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = initAutocomplete;
      document.head.appendChild(script);
    } else {
      initAutocomplete();
    }
  }, []);

  const initAutocomplete = () => {
    if (!inputRef.current) return;

    const auto = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ["address"],
      componentRestrictions: { country: "us" }, // Adjust as needed
    });

    auto.addListener("place_changed", () => {
      const place = auto.getPlace();
      if (!place.geometry) return;

      const addressData = {
        address: place.formatted_address,
        latitude: place.geometry.location.lat(),
        longitude: place.geometry.location.lng(),
        city: extractComponent(place, "locality"),
        state: extractComponent(place, "administrative_area_level_1"),
        zipCode: extractComponent(place, "postal_code"),
      };

      onAddressSelect(addressData);
    });

    setAutocomplete(auto);
  };

  const extractComponent = (place: any, type: string) => {
    const component = place.address_components?.find((c: any) =>
      c.types.includes(type)
    );
    return component?.long_name || "";
  };

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Enter your address"
      className="w-full p-3 border border-gray-300 rounded-lg"
    />
  );
}
```

---

## 🚀 Next Steps

### Immediate (Quick Wins):

1. ✅ Add API client methods for addresses in `frontend/lib/api.ts`
2. ✅ Create address management UI
3. ✅ Update booking flow to include address selection
4. ✅ Show client location to provider in booking requests

### Short Term (This Week):

1. 🔄 Integrate Google Maps Autocomplete
2. 🔄 Add maps to show provider locations
3. 🔄 Provider signup with location picker
4. 🔄 Display distance on all service cards

### Long Term (Future Enhancements):

- Real-time distance-based search radius adjustment
- Map view of all nearby providers
- Route calculation & navigation
- Service area boundaries for providers
- Multi-language address support

---

## 📊 Testing Checklist

### Client Flow:

- [ ] Client can add multiple addresses
- [ ] Client can set default address
- [ ] Client can select address when booking
- [ ] Address is saved with booking
- [ ] Client can manage (edit/delete) addresses

### Provider Flow:

- [ ] Provider can add location during signup
- [ ] Provider can update location in profile
- [ ] Provider sees client address in booking requests
- [ ] Provider sees distance to client
- [ ] Provider can view location on map

### Booking Flow:

- [ ] Distance is calculated correctly
- [ ] Nearest providers appear first
- [ ] Provider selection works
- [ ] Booking includes all location data
- [ ] Maps display correctly

---

## 🔐 Security Notes

1. **API Key Protection**: Never expose Google Maps API key in frontend code without restrictions
2. **Key Restrictions**: Set up API key restrictions in Google Cloud Console:

   - HTTP referrers (websites) - limit to your domain
   - API restrictions - limit to specific APIs

3. **Address Validation**: Backend should validate coordinates before storing

4. **Privacy**: Don't expose exact client addresses to providers until booking is confirmed

---

## 📞 Support & Resources

- Google Maps JavaScript API: https://developers.google.com/maps/documentation/javascript
- Places Autocomplete: https://developers.google.com/maps/documentation/javascript/places-autocomplete
- Geocoding API: https://developers.google.com/maps/documentation/geocoding
