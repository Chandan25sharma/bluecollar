# Location-Based Service Matching Implementation

## ✅ Phase 1: Backend (COMPLETED)

### Database Schema Updates

- ✅ Added address fields to `ClientProfile` and `ProviderProfile`:
  - `address` (String) - Full address from Google Maps
  - `latitude` (Float) - GPS coordinates
  - `longitude` (Float) - GPS coordinates
  - `city`, `state`, `zipCode` (String) - For filtering
- ✅ Added `distance` (Float) to `Booking` model to store calculated distance
- ✅ Migrated database with `npx prisma db push`
- ✅ Updated seed data with test addresses in New York

### API Endpoints

- ✅ Created `/api/services/nearby` endpoint
  - Query params: `latitude`, `longitude`, `category?`, `maxDistance?` (default 50km)
  - Returns services sorted by nearest providers first
  - Includes distance calculation using Haversine formula

### Utilities

- ✅ Created `distance.util.ts` with Haversine formula for accurate distance calculation
- ✅ Integrated into services.service.ts

### Test Data

- ✅ Client: John Client @ Times Square area (40.7589, -73.9851)
- ✅ Provider 1: Mike Plumber @ SoHo (40.7205, -74.0009) - ~5km away
- ✅ Provider 2: Sarah Electrician @ Midtown (40.7614, -73.9776) - ~0.5km away

---

## 🔄 Phase 2: Frontend - Client Registration (NEXT)

### 1. Add Google Maps Autocomplete to Signup

**Install Google Maps Library:**
\`\`\`bash
cd frontend
npm install @react-google-maps/api
\`\`\`

**Get Google Maps API Key:**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API
4. Create API key (restrict to your domain in production)
5. Add to `frontend/.env.local`:
   \`\`\`
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   \`\`\`

**Update Client Signup Page:**
File: `frontend/app/auth/signup/client/page.tsx`

Add fields:

- Address input with Google Places Autocomplete
- Auto-fill city, state, zipCode
- Hidden lat/lng fields
- Age (optional)

**Update API Call:**
Include address data in signup request:
\`\`\`typescript
const response = await authAPI.clientSignup({
email,
password,
phone,
name,
age,
address,
latitude,
longitude,
city,
state,
zipCode
});
\`\`\`

### 2. Update Backend Signup Handler

File: `backend/src/auth/auth.controller.ts`

Update `clientSignup` to accept and save address fields in ClientProfile.

---

## 🔄 Phase 3: Frontend - Nearby Services Display

### Update Client Dashboard "Available Services" Tab

File: `frontend/app/dashboard/client/page.tsx`

**Changes:**

1. **Get Client Location on Component Mount:**
   \`\`\`typescript
   useEffect(() => {
   fetchClientProfile(); // Get client's saved address
   }, []);
   \`\`\`

2. **Fetch Nearby Services:**
   \`\`\`typescript
   const fetchNearbyServices = async () => {
   if (clientProfile?.latitude && clientProfile?.longitude) {
   const response = await servicesAPI.getNearbyServices(
   clientProfile.latitude,
   clientProfile.longitude,
   selectedCategory,
   50 // 50km radius
   );
   setServices(response.data);
   }
   };
   \`\`\`

3. **Update Service Cards:**

   - Show provider name and location
   - Display distance (e.g., "2.5 km away")
   - Show provider address
   - Add "Select Provider" button

4. **Service Card Layout:**
   \`\`\`tsx
   <div className="service-card">
     <div className="service-info">
       <h3>{service.title}</h3>
       <p>{service.description}</p>
       <span className="category">{service.category}</span>
     </div>
     
     <div className="provider-info">
       <div className="provider-name">
         👤 {service.provider.name}
       </div>
       <div className="provider-location">
         📍 {service.distance} km away
       </div>
       <div className="provider-address text-sm text-gray-500">
         {service.provider.address}
       </div>
     </div>
     
     <div className="service-footer">
       <span className="price">${service.price}</span>
       <button onClick={() => handleBookService(service)}>
         Select Provider & Book
       </button>
     </div>
   </div>
   \`\`\`

---

## 🔄 Phase 4: Provider Selection & Booking Flow

### Update Booking Page

File: `frontend/app/booking/[serviceId]/page.tsx`

**Show Provider Details:**

- Provider name
- Provider rating (if available)
- Distance from client
- Provider address
- Provider skills

**Booking Form Updates:**

- Display selected provider clearly
- Show estimated distance
- Calculate travel/service time based on distance
- Send provider info with booking

### Backend Booking Handler

File: `backend/src/bookings/bookings.service.ts`

Update `createBooking` method:

- Calculate and save distance between client and provider
- Include distance in booking record
- Use distance for pricing adjustments (optional)

---

## 📋 Implementation Checklist

### Immediate Next Steps:

- [ ] Get Google Maps API key
- [ ] Install @react-google-maps/api in frontend
- [ ] Update client signup page with address autocomplete
- [ ] Update backend client signup to save address
- [ ] Update client dashboard to fetch nearby services
- [ ] Redesign service cards with provider location info
- [ ] Update booking page with provider details
- [ ] Test complete flow: Signup → Browse Nearby → Select Provider → Book

### Future Enhancements:

- [ ] Real-time location tracking
- [ ] Dynamic pricing based on distance
- [ ] Provider search radius preference
- [ ] Map view of nearby providers
- [ ] Filter by distance ranges (< 5km, < 10km, etc.)
- [ ] Provider availability based on location
- [ ] Travel time estimates
- [ ] Multi-provider comparison

---

## Testing Plan

### Test Scenario 1: Client Signup with Address

1. Navigate to client signup
2. Fill basic details
3. Start typing address in Google Autocomplete
4. Select address from dropdown
5. Verify lat/lng auto-populated
6. Submit and verify saved to database

### Test Scenario 2: Nearby Services

1. Login as client
2. Go to "Available Services" tab
3. Verify services show distance
4. Verify sorted by nearest first
5. Filter by category
6. Verify distances update correctly

### Test Scenario 3: Book with Provider Selection

1. Click "Select Provider & Book" on service
2. Verify provider details shown
3. Fill booking form
4. Submit booking
5. Verify provider receives notification
6. Verify distance saved in booking

---

## API Reference

### New Endpoint: GET /api/services/nearby

**Query Parameters:**

- `latitude` (required): Client's latitude
- `longitude` (required): Client's longitude
- `category` (optional): Filter by service category
- `maxDistance` (optional): Maximum distance in km (default: 50)

**Response:**
\`\`\`json
[
{
"id": "service_id",
"title": "Emergency Plumbing",
"description": "Fast plumbing service",
"category": "Plumbing",
"price": 50,
"duration": "2 hours",
"distance": 2.5,
"provider": {
"id": "provider_id",
"name": "Mike Plumber",
"address": "456 Broadway, New York, NY",
"latitude": 40.7205,
"longitude": -74.0009,
"distance": 2.5,
"user": {
"email": "provider@test.com",
"phone": "+1234567891"
}
}
}
]
\`\`\`

---

## Database Schema Reference

\`\`\`prisma
model ClientProfile {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
age Int?
address String?
latitude Float?
longitude Float?
city String?
state String?
zipCode String?
userId String @unique @db.ObjectId
}

model ProviderProfile {
id String @id @default(auto()) @map("\_id") @db.ObjectId
name String
skills String[]
rate Float
verified Boolean @default(false)
address String?
latitude Float?
longitude Float?
city String?
state String?
zipCode String?
userId String @unique @db.ObjectId
}

model Booking {
id String @id @default(auto()) @map("\_id") @db.ObjectId
distance Float? // Distance in kilometers
// ... other fields
}
\`\`\`

---

## Environment Variables Needed

\`\`\`env

# frontend/.env.local

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_URL=http://localhost:4001/api
\`\`\`
