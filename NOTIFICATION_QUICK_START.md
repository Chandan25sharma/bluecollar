# Quick Start Guide - Notification & Location System

## ✅ What's Already Done

### Backend (Fully Implemented):

- ✅ Database schema updated with Notification model
- ✅ Booking model has tracking timestamps (acceptedAt, completedAt, cancelledAt)
- ✅ NotificationsService with auto-notification on booking events
- ✅ NotificationsController with REST API endpoints
- ✅ Integration in BookingsService (sends notifications automatically)
- ✅ Backend server running on port 4001

### Frontend (Components Ready):

- ✅ NotificationBell component created
- ✅ API methods added to lib/api.ts
- ⏳ Need to add NotificationBell to dashboard layouts

## 🚀 How to Use

### Step 1: Add NotificationBell to Client Dashboard

**File:** `frontend/app/dashboard/client/page.tsx`

Add this import at the top:

```tsx
import NotificationBell from "@/components/NotificationBell";
```

Add the bell to your header/navbar:

```tsx
<div className="flex items-center gap-4">
  <NotificationBell />
  {/* other header items */}
</div>
```

### Step 2: Add NotificationBell to Provider Dashboard

**File:** `frontend/app/dashboard/provider/page.tsx`

Same as above:

```tsx
import NotificationBell from "@/components/NotificationBell";

// In your header:
<div className="flex items-center gap-4">
  <NotificationBell />
  {/* other header items */}
</div>;
```

### Step 3: Test the Workflow

#### Create a Booking (Client):

```
1. Login as: client@test.com / password123
2. Browse services
3. Create a booking
4. ✅ Provider will get notification automatically
```

#### Provider Sees Location Before Accepting:

```
1. Login as: provider1@test.com / password123
2. Click notification bell (red badge shows unread count)
3. See "New Booking Request" with distance
4. Click "View Location" → Opens approximate area on Google Maps
5. Decide to accept or reject
```

#### Provider Accepts Booking:

```
1. Provider clicks "Accept" button on booking
2. ✅ Client gets instant notification
3. Provider now sees full client address
```

#### Client Gets Provider Contact:

```
1. Client clicks notification bell
2. See "Booking Accepted!" notification
3. Notification shows:
   - ✅ Provider name
   - ✅ Provider phone (clickable)
   - ✅ "Track on Google Maps" button
```

## 📋 API Endpoints Available

### Notifications:

```
GET    /api/notifications                  // Get all notifications
GET    /api/notifications?unread=true      // Get only unread
GET    /api/notifications/unread-count     // Get unread count
PUT    /api/notifications/:id/read         // Mark as read
PUT    /api/notifications/mark-all-read    // Mark all as read
```

### Bookings (Updated):

```
POST   /api/bookings                       // Creates booking + notifies provider
PUT    /api/bookings/:id/status            // Updates status + notifies client
```

## 🔔 Notification Types

| Event             | Recipient | Contains                                |
| ----------------- | --------- | --------------------------------------- |
| BOOKING_CREATED   | Provider  | Client name, distance, location preview |
| BOOKING_ACCEPTED  | Client    | Provider name, phone, tracking link     |
| BOOKING_COMPLETED | Client    | Request to leave review                 |
| BOOKING_CANCELLED | Both      | Cancellation notice                     |

## 📍 Location Privacy Flow

### Before Acceptance (PENDING):

**Provider Can See:**

- ✅ Distance (e.g., "5.2 km away")
- ✅ Approximate area on map (zoom level 15)
- ✅ Client first name

**Provider CANNOT See:**

- ❌ Exact address
- ❌ Client phone number

### After Acceptance (ACCEPTED):

**Client Can See:**

- ✅ Provider full name
- ✅ Provider phone number (clickable)
- ✅ Track provider location
- ✅ Navigate to provider

**Provider Can See:**

- ✅ Client full address
- ✅ Exact coordinates
- ✅ Client contact info
- ✅ Navigate to client location

## 🎨 Notification Bell Features

- **Real-time Updates**: Auto-refreshes every 30 seconds
- **Unread Badge**: Red badge shows unread count
- **Dropdown Panel**: Click bell to see notifications
- **Rich Content**: Shows booking details, contact info, map links
- **Mark as Read**: Individual or mark all
- **Time Stamps**: Shows "5m ago", "2h ago", etc.
- **Action Buttons**: Direct links to Google Maps

## 🔧 Customization Options

### Change Refresh Interval:

```tsx
// In NotificationBell.tsx, line 44:
const interval = setInterval(fetchUnreadCount, 30000); // Change 30000 to desired ms
```

### Add Sound Notification:

```tsx
useEffect(() => {
  if (unreadCount > previousCount) {
    // Play notification sound
    const audio = new Audio("/notification-sound.mp3");
    audio.play();
  }
}, [unreadCount]);
```

### Add Desktop Notifications:

```tsx
if (unreadCount > previousCount && "Notification" in window) {
  Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      new Notification("New Booking Request", {
        body: "You have a new booking request!",
        icon: "/logo.png",
      });
    }
  });
}
```

## 🐛 Troubleshooting

### Notifications Not Showing:

1. Check backend is running: `http://localhost:4001/api/notifications`
2. Check browser console for errors
3. Verify JWT token is valid (login again)

### Location Not Working:

1. Ensure booking has clientLatitude and clientLongitude
2. Check Google Maps links are being generated correctly
3. Verify browser allows opening external links

### Unread Count Not Updating:

1. Check network tab for API calls every 30 seconds
2. Verify `/api/notifications/unread-count` endpoint works
3. Try manually marking as read

## 📦 Files Reference

### Backend:

```
backend/
├── prisma/schema.prisma                           (Updated)
├── src/
│   ├── notifications/
│   │   ├── notifications.service.ts               (NEW)
│   │   ├── notifications.controller.ts            (NEW)
│   │   └── notifications.module.ts                (NEW)
│   ├── bookings/
│   │   ├── bookings.service.ts                    (Updated)
│   │   ├── bookings.module.ts                     (Updated)
│   │   └── dto/create-booking.dto.ts              (NEW)
│   └── app.module.ts                              (Updated)
```

### Frontend:

```
frontend/
├── components/
│   └── NotificationBell.tsx                       (NEW)
└── lib/
    └── api.ts                                     (Updated)
```

## 🎯 Next Steps

1. **Add NotificationBell to dashboards** (see Step 1 & 2 above)
2. **Test complete workflow** (create booking → accept → track)
3. **Customize notification styling** (match your theme)
4. **Add push notifications** (optional - using Firebase)
5. **Add real-time updates** (optional - using WebSocket)

## 💡 Tips

- Notifications auto-clear after 30 days (add cleanup job)
- Consider adding email notifications for important events
- Add notification preferences (allow users to opt out)
- Track notification open rates for analytics
- Add notification categories for filtering

---

**Everything is ready to use! Just add the NotificationBell component to your dashboards and test the workflow.** 🎉
