# 🧪 Complete Testing Guide - BlueCollar Platform

## 📋 Overview

This guide will walk you through testing the complete booking notification flow:
**Client books service → Provider gets notification → Provider accepts → Client gets confirmation**

---

## 🚀 Prerequisites

### 1. Start Backend Server

```bash
cd backend
npm run dev
```

✅ Backend should run on: `http://localhost:4001`

### 2. Start Frontend Server

```bash
cd frontend
npm run dev
```

✅ Frontend should run on: `http://localhost:3000`

### 3. Seed Database (if not already done)

```bash
cd backend
npm run seed
```

---

## 👥 Test Accounts

### Client Account

- **Email:** `client@test.com`
- **Password:** `password123`
- **Profile:** John Client (Age: 30)

### Provider Account 1 (Plumber)

- **Email:** `provider1@test.com`
- **Password:** `password123`
- **Profile:** Mike Plumber
- **Services:** Emergency Plumbing ($50), House Cleaning ($40)

### Provider Account 2 (Electrician)

- **Email:** `provider2@test.com`
- **Password:** `password123`
- **Profile:** Sarah Electrician
- **Service:** Home Electrical Installation ($60)

---

## 🔄 Complete Booking Flow Test

### Step 1: Client Books a Service

1. **Login as Client**

   - Navigate to: `http://localhost:3000/login`
   - Email: `client@test.com`
   - Password: `password123`
   - Click "Login"

2. **View Client Dashboard**

   - You'll be redirected to: `/dashboard/client`
   - Check the stats cards showing your bookings
   - Notice the tabs: Overview, My Bookings, **Available Services**

3. **Browse Available Services**

   - Click on the "**Available Services**" tab
   - You should see 3 services:
     - ⚡ Home Electrical Installation ($60) - Sarah Electrician
     - 🚰 Emergency Plumbing Service ($50) - Mike Plumber
     - 🧹 House Cleaning Service ($40) - Mike Plumber

4. **Book a Service**

   - Click "**Book Now**" on any service (e.g., Emergency Plumbing)
   - You'll be taken to: `/booking/[serviceId]`
   - Fill in the booking form:
     - **Preferred Date & Time:** Select tomorrow at 10:00 AM
     - **Additional Notes:** "Please bring extra tools for pipe repair"
   - Review the booking summary showing:
     - Service name
     - Duration
     - Total amount
   - Click "**Confirm Booking**"

5. **Success Confirmation**

   - ✅ See success message: "Booking Successful!"
   - Message: "Your booking request has been sent to the provider"
   - Redirected back to client dashboard after 2 seconds

6. **Verify Booking Created**
   - On client dashboard, check:
     - **Total Bookings:** Should increase by 1
     - **Pending:** Should show 1 pending booking
   - See **blue notification banner** at top:
     - "⏳ You have 1 pending request waiting for provider confirmation"
   - Click "**My Bookings**" tab to see your booking with:
     - Status: 🟡 **PENDING**
     - Service details
     - Your notes

---

### Step 2: Provider Sees Notification & Accepts

1. **Logout from Client Account**

   - Click "Logout" button in client dashboard

2. **Login as Provider**

   - Navigate to: `http://localhost:3000/login`
   - Email: `provider1@test.com` (or the provider whose service you booked)
   - Password: `password123`
   - Click "Login"

3. **Provider Dashboard - See Notification**

   - You'll be redirected to: `/dashboard/provider`
   - **🚨 IMPORTANT:** Check for **yellow notification banner** at top:
     - "🔔 You have 1 pending booking request waiting for your response!"
     - Shows animated bell icon
     - Button: "**View Requests**"
   - Stats show:
     - **Pending:** 1 pending booking

4. **View Booking Request Details**

   - Click "**View Requests**" button OR click "**My Bookings**" tab
   - You'll see the booking request with:
     - **Status:** 🟡 PENDING
     - **Client:** John Client
     - **Service:** Emergency Plumbing Service
     - **Preferred Date:** Tomorrow at 10:00 AM
     - **Notes:** "Please bring extra tools for pipe repair"
     - **Amount:** $50
     - **Two buttons:**
       - 🟢 **Accept** (Blue button)
       - 🔴 **Reject** (Red button)

5. **Accept the Booking**
   - Click the "**Accept**" button
   - ✅ Booking status immediately updates to: 🔵 **CONFIRMED**
   - Button changes to: "**Start Work**" (for when work begins)
   - The yellow notification banner disappears
   - Pending count decreases to 0

---

### Step 3: Client Gets Confirmation

1. **Logout from Provider Account**

   - Click "Logout" button

2. **Login Back as Client**

   - Email: `client@test.com`
   - Password: `password123`

3. **See Confirmation Notification**

   - On client dashboard, check:
     - **🎉 Green notification banner** at top:
       - "Great news! You have 1 confirmed booking. The provider will visit you at the scheduled time!"
     - No more pending bookings
     - **Completed:** Shows updated count

4. **View Confirmed Booking Details**
   - Click "**My Bookings**" tab
   - See your booking with:
     - **Status:** 🔵 **CONFIRMED**
     - Provider: Mike Plumber
     - Scheduled date & time
     - All details visible

---

## 🔄 Additional Workflow Tests

### Test Scenario 2: Provider Rejects Booking

1. **As Client:** Book another service
2. **As Provider:** Click "**Reject**" button instead of Accept
3. **Result:**
   - Status changes to: 🔴 **CANCELLED**
   - Client sees rejected booking in "My Bookings"

### Test Scenario 3: Complete Booking Workflow

1. **As Provider (after accepting):**

   - Click "**Start Work**" → Status: 🟣 **IN_PROGRESS**
   - Click "**Mark as Completed**" → Status: 🟢 **COMPLETED**

2. **As Client:**
   - See completed booking
   - Total spent increases by booking amount

---

## ✅ Expected Database Flow

### When Client Books:

```
1. POST /api/bookings
   Body: { serviceId, date, notes }

2. Database creates:
   - Booking record with status: PENDING
   - Links to client profile & service

3. Response: Booking details returned
```

### When Provider Accepts:

```
1. PUT /api/bookings/:id/status
   Body: { status: "CONFIRMED" }

2. Database updates:
   - Booking.status = CONFIRMED
   - Timestamp updated

3. Response: Updated booking returned
```

### When Client Refreshes:

```
1. GET /api/bookings/client/my-bookings

2. Database returns:
   - All bookings for this client
   - With updated status: CONFIRMED

3. UI shows: Green confirmation banner
```

---

## 🎨 UI Indicators to Verify

### Client Dashboard

- ✅ Blue banner for pending bookings
- ✅ Green banner for confirmed bookings
- ✅ Stats cards update in real-time
- ✅ "Available Services" tab shows all active services
- ✅ Booking cards show correct status colors

### Provider Dashboard

- ✅ Yellow banner with animated bell for pending requests
- ✅ "View Requests" button navigates to bookings tab
- ✅ Accept/Reject buttons visible for PENDING bookings
- ✅ Status workflow buttons: Start Work → Mark Completed
- ✅ Stats update when bookings change status

### Booking Page

- ✅ Service details displayed correctly
- ✅ Form validation works
- ✅ Success confirmation before redirect
- ✅ Min date/time prevents past bookings

---

## 🐛 Troubleshooting

### Backend Not Running

```bash
# Check if running
curl http://localhost:4001/api/health

# If not, start it
cd backend
npm run dev
```

### Frontend Not Connected

```bash
# Check .env.local file exists
cat frontend/.env.local

# Should contain:
NEXT_PUBLIC_API_URL=http://localhost:4001/api
```

### Database Issues

```bash
# Re-seed database
cd backend
npm run seed

# Check Prisma connection
npx prisma studio
```

### Login Issues

- Clear browser localStorage
- Verify test accounts in database
- Check console for JWT errors

---

## 📊 Success Criteria

✅ **Client Flow:**

- Can view all available services
- Can book a service with preferred time
- Sees pending status immediately
- Gets confirmation when provider accepts
- Can view all booking history

✅ **Provider Flow:**

- Sees pending booking notifications
- Can view client details and notes
- Can accept/reject bookings
- Can update booking status (Start/Complete)
- Can manage multiple services

✅ **Database Flow:**

- Bookings persist correctly
- Status updates propagate
- Relationships maintained (client ↔ booking ↔ service ↔ provider)
- Data integrity preserved

✅ **Real-time Updates:**

- Changes reflect immediately after actions
- No page refresh needed for status updates
- Notifications show correct counts
- UI updates match database state

---

## 🎯 Next Steps After Testing

Once you've verified the flow works:

1. **Test with multiple bookings** (book 2-3 services)
2. **Test different providers** (provider1 vs provider2)
3. **Test edge cases:**

   - Booking in the past (should fail)
   - Missing notes (should work)
   - Multiple pending bookings
   - Rapid accept/reject clicks

4. **Consider adding:**
   - Email notifications
   - SMS alerts
   - Push notifications
   - Real-time WebSocket updates

---

## 📞 Support

If you encounter issues:

1. Check browser console for errors
2. Check backend terminal for API errors
3. Verify database has seeded data
4. Ensure both servers are running

**Happy Testing! 🚀**
