# Notification & Location Tracking System

## Overview

This system implements real-time notifications and location sharing between clients and providers during the booking workflow.

## Features Implemented

### 1. **Notification System** ✅

- Real-time notification bell with unread count
- Different notification types for booking events
- Mark as read / Mark all as read functionality
- Notifications persist in database
- Auto-refresh every 30 seconds

### 2. **Location Sharing Workflow** ✅

#### **Before Provider Accepts** (PENDING status):

- ✅ Provider can see client's **approximate location** (distance in km)
- ✅ Provider can view client location on Google Maps
- ✅ Helps provider decide if they want to accept the job
- ❌ Full address is NOT shown yet

#### **After Provider Accepts** (ACCEPTED status):

- ✅ Client gets instant notification
- ✅ Client can see provider's **full contact details** (phone number, email)
- ✅ Client can track provider's location on Google Maps
- ✅ Provider can see client's **full address** and coordinates
- ✅ Both parties can navigate using Google Maps

### 3. **Notification Types**

```typescript
enum NotificationType {
  BOOKING_CREATED       // Provider: New booking request
  BOOKING_ACCEPTED      // Client: Provider accepted
  BOOKING_COMPLETED     // Client: Service completed
  BOOKING_CANCELLED     // Both: Booking cancelled
  PROVIDER_ARRIVING     // Client: Provider on the way (future)
  PAYMENT_RECEIVED      // Provider: Payment processed (future)
  REVIEW_RECEIVED       // Provider: New review (future)
}
```

## Database Schema Updates

### Booking Model - New Fields:

```prisma
model Booking {
  // ... existing fields

  // Tracking timestamps
  acceptedAt       DateTime?  // When provider accepted
  completedAt      DateTime?  // When service completed
  cancelledAt      DateTime?  // When booking cancelled
  estimatedArrival DateTime?  // Provider's ETA (future use)
  providerNotes    String?    // Provider notes after accepting

  // Relations
  notifications    Notification[]
}
```

### Notification Model - New:

```prisma
model Notification {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId  // Recipient
  type      NotificationType
  title     String
  message   String
  read      Boolean  @default(false)
  bookingId String?  @db.ObjectId
  booking   Booking? @relation(...)
  createdAt DateTime @default(now())
}
```

## API Endpoints

### Notifications API:

```
GET    /api/notifications                  // Get all notifications
GET    /api/notifications?unread=true      // Get only unread
GET    /api/notifications/unread-count     // Get unread count
PUT    /api/notifications/:id/read         // Mark one as read
PUT    /api/notifications/mark-all-read    // Mark all as read
```

### Updated Booking Endpoints:

```
POST   /api/bookings                       // Create booking (notifies provider)
PUT    /api/bookings/:id/status            // Update status (notifies client)
```

## Workflow Diagram

### Client Creates Booking:

```
1. Client fills booking form
2. Backend creates booking with status: PENDING
3. Backend stores client location (lat, lng, address)
4. Backend calculates distance to provider
5. ✅ Provider gets notification: "New booking request (5.2 km away)"
```

### Provider Views Pending Booking:

```
1. Provider sees booking notification
2. Provider can see:
   - Service details
   - Client name
   - Distance (5.2 km)
   - 🗺️ "View Location" button (Google Maps)
3. Provider clicks location → Opens approximate area on map
4. Provider decides to accept or reject
```

### Provider Accepts Booking:

```
1. Provider clicks "Accept" button
2. Backend updates:
   - status: PENDING → ACCEPTED
   - acceptedAt: current timestamp
3. ✅ Client gets notification: "Provider accepted your booking!"
4. Client notification includes:
   - Provider name
   - 📞 Phone number (clickable)
   - 📍 "Track on Google Maps" button
```

### Client Views Accepted Booking:

```
1. Client clicks notification
2. Client can see:
   - ✅ Provider accepted
   - Provider name and phone
   - Service details
   - Google Maps tracking link
3. Client can call provider directly
4. Client can track provider's location in real-time
```

## Frontend Components

### NotificationBell Component (`components/NotificationBell.tsx`):

```tsx
Features:
- 🔔 Bell icon with unread badge
- Dropdown panel with notification list
- Auto-refresh every 30 seconds
- Mark as read / Mark all as read
- Provider contact details (for accepted bookings)
- Google Maps integration
- Time ago formatting
```

Usage:

```tsx
import NotificationBell from "@/components/NotificationBell";

// Add to dashboard navbar
<NotificationBell />;
```

### Integration in Dashboards:

```tsx
// Client Dashboard
- Shows accepted bookings with provider phone
- "Track Provider" button with Google Maps link

// Provider Dashboard
- Shows pending bookings with client location preview
- "View Location" button before accepting
- Full address after accepting
```

## Google Maps Integration

### For Providers (Before Accept):

```tsx
const getGoogleMapsLink = (lat: number, lng: number) => {
  return `https://www.google.com/maps?q=${lat},${lng}&z=15`;
};

// Shows approximate area (zoom level 15)
// Provider can see distance but not exact address
```

### For Clients (After Accept):

```tsx
const getGoogleMapsLink = (lat: number, lng: number, address?: string) => {
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
  }
  return `https://www.google.com/maps?q=${lat},${lng}&z=18`;
};

// Shows exact location (zoom level 18)
// Client can navigate to provider
```

## Privacy & Security

### Before Acceptance (PENDING):

✅ Provider sees:

- Distance (5.2 km)
- General area on map
- Client name

❌ Provider CANNOT see:

- Exact address
- Apartment/house number
- Client phone number

### After Acceptance (ACCEPTED):

✅ Client sees:

- Provider full name
- Provider phone number
- Provider email
- Provider location for tracking

✅ Provider sees:

- Client full address
- Exact coordinates
- Client phone number (from booking)

## Testing Instructions

### 1. Create Booking (Client):

```
1. Login as client@test.com
2. Browse services
3. Create booking with your location
4. ✅ Check provider gets notification
```

### 2. Provider Receives Notification:

```
1. Login as provider1@test.com
2. Click notification bell (should show count)
3. See "New Booking Request" notification
4. Click "View Location" → Opens Google Maps with approximate area
5. Check distance is calculated correctly
```

### 3. Provider Accepts Booking:

```
1. Provider clicks "Accept" button
2. ✅ Client should get notification immediately
3. Provider can now see full client address
4. Provider can navigate to exact location
```

### 4. Client Gets Provider Info:

```
1. Client clicks notification bell
2. See "Booking Accepted!" notification
3. Click to expand details
4. See provider phone number (clickable)
5. Click "Track on Google Maps"
6. ✅ Should open map with provider's location
```

## Future Enhancements

### Phase 2 (Recommended):

- [ ] Real-time provider tracking (WebSocket)
- [ ] "Provider is arriving" notification with ETA
- [ ] In-app chat between client and provider
- [ ] Push notifications (Firebase Cloud Messaging)
- [ ] SMS notifications for critical updates

### Phase 3 (Advanced):

- [ ] Live location sharing during service
- [ ] Route optimization for providers
- [ ] Traffic-aware ETA calculations
- [ ] Geofencing (notify when provider enters area)

## Configuration

### Environment Variables (Backend):

```env
# Already configured
DATABASE_URL=mongodb+srv://...
JWT_SECRET=your_secret_key
```

### Environment Variables (Frontend):

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

## Files Created/Modified

### Backend:

```
✅ backend/prisma/schema.prisma                     (Updated)
✅ backend/src/notifications/notifications.service.ts (NEW)
✅ backend/src/notifications/notifications.controller.ts (NEW)
✅ backend/src/notifications/notifications.module.ts (NEW)
✅ backend/src/bookings/bookings.service.ts         (Updated)
✅ backend/src/bookings/bookings.module.ts          (Updated)
✅ backend/src/app.module.ts                        (Updated)
```

### Frontend:

```
✅ frontend/components/NotificationBell.tsx         (NEW)
✅ frontend/lib/api.ts                              (Updated)
```

## Summary

This implementation provides:

✅ Real-time notifications for booking events  
✅ Privacy-preserving location sharing  
✅ Progressive information disclosure (more details after acceptance)  
✅ Google Maps integration for navigation  
✅ Provider contact details after acceptance  
✅ Distance calculation before acceptance  
✅ Notification persistence and read tracking  
✅ Clean UI with notification bell and dropdown

The system balances **privacy** (limited info before acceptance) with **transparency** (full details after commitment), creating a trustworthy platform for both clients and providers! 🎉
