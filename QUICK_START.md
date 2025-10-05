# BlueCollar - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (already configured)
- npm or yarn package manager

### 1. Backend Setup & Start

```powershell
# Navigate to backend
cd C:\PROJECTS\bluecollar\backend

# Install dependencies (if not already done)
npm install

# Generate Prisma client
npx prisma generate

# Seed the database with test data
npm run seed

# Start the backend server
npm run start:dev
```

**Backend should start on:** `http://localhost:4001/api`

**Verify backend is running:**

```powershell
# In a new terminal
Invoke-WebRequest -Uri "http://localhost:4001/api/services" -Method GET
```

---

### 2. Frontend Setup & Start

```powershell
# Navigate to frontend
cd C:\PROJECTS\bluecollar\frontend

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev
```

**Frontend should start on:** `http://localhost:3000`

---

## 🧪 Testing the Application

### Test User Credentials

**Client Account:**

- Email: `client@test.com`
- Password: `password123`
- Dashboard: `/dashboard/client`

**Provider Account 1 (Plumber):**

- Email: `provider1@test.com`
- Password: `password123`
- Dashboard: `/dashboard/provider`
- Services: Plumbing, Pipe Repair, Drain Cleaning

**Provider Account 2 (Electrician):**

- Email: `provider2@test.com`
- Password: `password123`
- Dashboard: `/dashboard/provider`
- Services: Electrical Work, Wiring, Light Installation

---

## 📝 Testing Flow

### 1. Test Login

1. Open browser: `http://localhost:3000/login`
2. Login with client credentials
3. Should redirect to: `http://localhost:3000/dashboard/client`
4. Verify user data displays correctly

### 2. Test Provider Login

1. Logout
2. Login with provider1 credentials
3. Should redirect to: `http://localhost:3000/dashboard/provider`
4. Verify services and bookings display

### 3. Test Services

1. Navigate to services page
2. Should see 3 services from database:
   - Emergency Plumbing Service ($50)
   - Home Electrical Installation ($60)
   - House Cleaning Service ($40)

### 4. Test Booking Flow (As Client)

1. Login as client
2. Browse services
3. Create a booking
4. View booking in "My Bookings"

### 5. Test Provider Workflow

1. Login as provider
2. View bookings from clients
3. Update booking status
4. Create new service

---

## 🐛 Troubleshooting

### Backend Not Starting

```powershell
# Check if port 4001 is already in use
netstat -ano | findstr :4001

# Kill process if needed
taskkill /PID <PID> /F

# Restart backend
npm run start:dev
```

### Frontend API Connection Issues

1. Check `.env.local` file exists in frontend folder
2. Verify `NEXT_PUBLIC_API_URL=http://localhost:4001/api`
3. Restart frontend server after changing .env

### Database Connection Issues

1. Verify MongoDB Atlas connection string in `backend/.env`
2. Check network connection
3. Verify IP whitelist in MongoDB Atlas

### Clear Seeded Data

```powershell
# Backend directory
npm run seed
# This will clear and re-seed the database
```

---

## 📊 API Endpoints Reference

### Authentication

- `POST /api/auth/client-signup` - Register as client
- `POST /api/auth/provider-signup` - Register as provider
- `POST /api/auth/login` - Login (all users)

### Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `POST /api/services` - Create service (provider only)
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service
- `PUT /api/services/:id/toggle-status` - Toggle active status
- `GET /api/services/provider/my-services` - Get my services (provider only)

### Bookings

- `POST /api/bookings` - Create booking (client only)
- `GET /api/bookings/:id` - Get booking by ID
- `GET /api/bookings/client/my-bookings` - Get my bookings (client)
- `GET /api/bookings/provider/my-bookings` - Get my bookings (provider)
- `PUT /api/bookings/:id/status` - Update booking status

### Profiles

- `GET /api/profiles/client/me` - Get my client profile
- `GET /api/profiles/provider/me` - Get my provider profile
- `PUT /api/profiles/client` - Update client profile
- `PUT /api/profiles/provider` - Update provider profile
- `GET /api/profiles/providers` - Get all providers (with filters)

---

## 🔐 Authentication Flow

1. User logs in → Receives JWT token
2. Token stored in localStorage as `auth_token`
3. User data stored in localStorage as `user`
4. All API requests include token in Authorization header
5. Backend validates token for protected routes
6. Frontend redirects based on user role:
   - CLIENT → /dashboard/client
   - PROVIDER → /dashboard/provider
   - ADMIN → /dashboard/admin

---

## 📦 Database Schema Quick Reference

```
Users
- id, email, password, phone, role, verified

ClientProfile
- id, userId, name, age

ProviderProfile
- id, userId, name, skills[], rate, verified, bankName, bankAcc

Service
- id, title, description, price, category, duration, isActive, providerId

Booking
- id, status, date, notes, totalAmount, clientId, providerId, serviceId

Payment
- id, amount, commission, status, bookingId

Review
- id, rating, comment, bookingId, clientId, providerId
```

---

## ✅ Success Checklist

- [ ] Backend starts without errors on port 4001
- [ ] Frontend starts without errors on port 3000
- [ ] Can login as client
- [ ] Can login as provider
- [ ] Services display on homepage
- [ ] Client dashboard shows user data
- [ ] Provider dashboard shows services
- [ ] Can create a booking
- [ ] Provider can see bookings
- [ ] Can update booking status

---

## 🎯 Next Features to Implement

1. **Payments Integration** - Stripe/PayPal
2. **Real-time Notifications** - WebSocket/Socket.io
3. **File Uploads** - Provider documents, profile pictures
4. **Reviews & Ratings** - After service completion
5. **Search & Filters** - Advanced service search
6. **Admin Dashboard** - User management, analytics
7. **Email Notifications** - Booking confirmations
8. **Mobile Responsive** - Optimize for mobile devices

---

## 📞 Support

If you encounter any issues:

1. Check console logs (Frontend: Browser Console, Backend: Terminal)
2. Verify all environment variables are set correctly
3. Ensure MongoDB connection is active
4. Check network connectivity
5. Review error messages carefully

**Common Errors:**

- `ECONNREFUSED` - Backend not running
- `401 Unauthorized` - Invalid/expired token
- `404 Not Found` - Wrong API endpoint
- `500 Internal Server Error` - Backend error (check logs)
