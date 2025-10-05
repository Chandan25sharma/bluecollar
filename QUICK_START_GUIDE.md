# 🚀 BlueCollar Complete Setup & Testing Guide

## 📦 What's Already Done

### ✅ Backend (NestJS + MongoDB)

- **Database**: MongoDB Atlas connected (database: "bluecolor")
- **Authentication**: JWT-based auth with CLIENT/PROVIDER/ADMIN roles
- **Modules**: Auth, Services, Bookings, Profiles
- **API**: All endpoints ready and working

### ✅ Frontend (Next.js)

- **Pages**: Login, Signup, Client Dashboard, Provider Dashboard
- **API Integration**: Connected to backend at `http://localhost:4001/api`
- **Role-based Routing**: Redirects users based on their role

### ✅ Test Data Ready

```
Client Account:
- Email: client@test.com
- Password: password123
- Role: CLIENT
- Profile: John Client (Age: 30)

Provider Account 1:
- Email: provider1@test.com
- Password: password123
- Role: PROVIDER
- Profile: Mike Plumber
- Skills: Plumbing, Pipe Repair, Drain Cleaning
- Rate: $50/hour

Provider Account 2:
- Email: provider2@test.com
- Password: password123
- Role: PROVIDER
- Profile: Sarah Electrician
- Skills: Electrical Work, Wiring, Light Installation
- Rate: $60/hour

Services Created:
1. Emergency Plumbing Service - $50 (2 hours)
2. Home Electrical Installation - $60 (3 hours)
3. House Cleaning Service - $40 (4 hours)
```

---

## 🎯 Quick Start (3 Steps)

### Step 1: Seed the Database

```bash
cd C:\PROJECTS\bluecollar\backend
npm run seed
```

Expected output:

```
🌱 Starting seed...
🧹 Cleared existing data...
✅ Seed completed successfully!
Created:
- Client: client@test.com (Profile: John Client)
- Provider 1: provider1@test.com (Profile: Mike Plumber)
- Provider 2: provider2@test.com (Profile: Sarah Electrician)
- Services: Emergency Plumbing Service, Home Electrical Installation, House Cleaning Service
```

### Step 2: Start Backend Server

```bash
cd C:\PROJECTS\bluecollar\backend
npm run start:dev
```

Expected output:

```
[Nest] Starting Nest application...
✅ Backend successfully started on http://localhost:4001/api
🔗 Database connected successfully
```

### Step 3: Start Frontend

```bash
cd C:\PROJECTS\bluecollar\frontend
npm run dev
```

Expected output:

```
ready - started server on 0.0.0.0:3000
```

---

## 🧪 Testing the Application

### Test 1: Login as Client

1. Open browser: `http://localhost:3000/login`
2. Enter credentials:
   - Email: `client@test.com`
   - Password: `password123`
3. Click "Sign In"
4. **Expected**: Redirect to `/dashboard/client`
5. **Should See**:
   - Welcome message: "Welcome back, John Client!"
   - Stats cards showing: Total Bookings (0), Pending (0), etc.
   - Browse Services button

### Test 2: Login as Provider

1. Open browser (new tab): `http://localhost:3000/login`
2. Enter credentials:
   - Email: `provider1@test.com`
   - Password: `password123`
3. Click "Sign In"
4. **Expected**: Redirect to `/dashboard/provider`
5. **Should See**:
   - Welcome message: "Welcome back, Mike Plumber! ✓ Verified"
   - Stats showing services and bookings
   - Services tab showing 2 services (Plumbing & Cleaning)

### Test 3: Browse Services (as Client)

1. Login as client (client@test.com)
2. Click "Browse Services" button
3. **Expected**: See list of all 3 services
4. **Should See**:
   - Emergency Plumbing Service ($50)
   - Home Electrical Installation ($60)
   - House Cleaning Service ($40)

### Test 4: Provider Manages Services

1. Login as provider (provider1@test.com)
2. Go to "My Services" tab
3. **Expected**: See 2 services
   - Emergency Plumbing Service
   - House Cleaning Service
4. Try toggling service status (Active/Inactive)
5. **Expected**: Status changes successfully

---

## 📋 API Endpoints Reference

### Authentication

```
POST /api/auth/login
POST /api/auth/client-signup
POST /api/auth/provider-signup
```

### Services

```
GET    /api/services                    # Get all services
GET    /api/services/:id                # Get service by ID
GET    /api/services/provider/my-services # Get provider's services
POST   /api/services                    # Create service
PUT    /api/services/:id                # Update service
DELETE /api/services/:id                # Delete service
PUT    /api/services/:id/toggle-status  # Toggle active status
```

### Bookings

```
POST /api/bookings                      # Create booking
GET  /api/bookings/:id                  # Get booking by ID
GET  /api/bookings/client/my-bookings   # Get client's bookings
GET  /api/bookings/provider/my-bookings # Get provider's bookings
PUT  /api/bookings/:id/status           # Update booking status
```

### Profiles

```
GET /api/profiles/client/me            # Get client profile
GET /api/profiles/provider/me          # Get provider profile
PUT /api/profiles/client               # Update client profile
PUT /api/profiles/provider             # Update provider profile
GET /api/profiles/providers            # Get all providers (with filters)
```

---

## 🔧 Troubleshooting

### Backend not starting?

```bash
# Check if port 4001 is already in use
netstat -ano | findstr :4001

# If something is using it, kill the process or change PORT in .env
```

### Frontend not connecting to backend?

1. Verify backend is running: `http://localhost:4001/api/services`
2. Check `.env.local` in frontend folder:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4001/api
   ```
3. Restart frontend after changing .env

### Login not working?

1. Make sure you ran the seed script
2. Check backend console for errors
3. Open browser DevTools → Network tab
4. Look for `/api/auth/login` request
5. Check response status and data

### Database connection issues?

1. Verify MongoDB connection string in `backend/.env`
2. Make sure you have internet connection (for MongoDB Atlas)
3. Check Prisma client is generated:
   ```bash
   cd backend
   npx prisma generate
   ```

---

## 🎨 User Flows

### Client Flow

```
1. Login → Client Dashboard
2. Browse Services
3. Select Service
4. Create Booking
5. View Bookings in Dashboard
6. Track Booking Status
7. Rate Service (after completion)
```

### Provider Flow

```
1. Login → Provider Dashboard
2. View My Services
3. Add/Edit Services
4. See Incoming Bookings
5. Accept/Reject Bookings
6. Update Booking Status (Confirmed → In Progress → Completed)
7. View Earnings
```

---

## 📊 Current Database Schema

```
User
├── id, email, password, phone, role, verified
├── ClientProfile (name, age)
├── ProviderProfile (name, skills[], rate, verified, bankName, bankAcc)
└── AdminProfile (role)

Service
├── title, description, price, category, duration, isActive
└── Provider (relationship)

Booking
├── status (PENDING, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED)
├── date, notes, totalAmount
├── Client (relationship)
├── Provider (relationship)
├── Service (relationship)
├── Payment (relationship)
└── Review (relationship)
```

---

## ✅ Testing Checklist

- [ ] Backend server starts successfully (port 4001)
- [ ] Frontend server starts successfully (port 3000)
- [ ] Database is seeded with test data
- [ ] Client can login and see dashboard
- [ ] Provider can login and see dashboard
- [ ] Services are displayed correctly
- [ ] Provider can view their services
- [ ] Logout works for both roles
- [ ] Role-based routing works (CLIENT → client dashboard, PROVIDER → provider dashboard)

---

## 🚀 Next Steps After Testing

1. **Create Booking Flow**: Allow clients to book services
2. **Booking Management**: Providers accept/reject bookings
3. **Payment Integration**: Add real payment flow (currently hardcoded)
4. **Reviews System**: Let clients review completed services
5. **Search & Filters**: Add service search and filtering
6. **Notifications**: Real-time updates for bookings
7. **Admin Panel**: Manage users, services, and payments

---

## 📝 Important Notes

- **Password**: All test accounts use `password123`
- **JWT Secret**: Stored in `backend/.env`
- **Database**: MongoDB Atlas (cloud-hosted)
- **Port 4001**: Backend API
- **Port 3000**: Frontend
- **Auto Profile Creation**: Profiles are created automatically on signup
- **Booking Status Flow**: PENDING → CONFIRMED → IN_PROGRESS → COMPLETED
- **Payment**: Automatically created when booking status is COMPLETED

---

## 🆘 Need Help?

If you encounter any issues:

1. Check backend console for error messages
2. Check frontend browser console
3. Verify all environment variables are set
4. Make sure MongoDB connection is active
5. Try re-running the seed script

**Backend Logs Location**: Terminal where you ran `npm run start:dev`
**Frontend Logs**: Browser DevTools Console
