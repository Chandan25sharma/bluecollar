# Admin Login Credentials

## 🔐 Test Users Created

### Admin User

- **Email**: `admin@bluecollar.com`
- **Password**: `password123`
- **Role**: ADMIN (SUPER)
- **Phone**: +1234567899
- **Dashboard**: `/dashboard/admin`

### Client User

- **Email**: `client@test.com`
- **Password**: `password123`
- **Role**: CLIENT
- **Phone**: +1234567890
- **Profile**: John Client
- **Dashboard**: `/dashboard/client`

### Provider Users

#### Provider 1 - Mike Plumber

- **Email**: `provider1@test.com`
- **Password**: `password123`
- **Role**: PROVIDER
- **Phone**: +1234567891
- **Skills**: Plumbing, Pipe Repair, Drain Cleaning
- **Rate**: $50/hour
- **Location**: 456 Broadway, New York, NY 10013
- **Dashboard**: `/dashboard/provider`

#### Provider 2 - Sarah Electrician

- **Email**: `provider2@test.com`
- **Password**: `password123`
- **Role**: PROVIDER
- **Phone**: +1234567892
- **Skills**: Electrical Work, Wiring, Light Installation
- **Rate**: $60/hour
- **Location**: 789 5th Avenue, New York, NY 10022
- **Dashboard**: `/dashboard/provider`

---

## 🚀 How to Login as Admin

1. **Start the frontend** (if not running):

   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to login page**:

   - Go to: `http://localhost:3000/login`

3. **Enter admin credentials**:

   - Email: `admin@bluecollar.com`
   - Password: `password123`

4. **Auto-redirect to admin dashboard**:
   - After successful login, you'll be redirected to `/dashboard/admin`
   - Access admin features: Users, Services, Bookings, Payouts

---

## 📊 Admin Dashboard Features

The admin dashboard includes:

- **Stats Overview**: Total users, providers, bookings, revenue
- **User Management**: View and manage all users
- **Service Management**: Approve/reject provider services
- **Booking Management**: Monitor all platform bookings
- **Payout Management**: Process provider payouts
- **Recent Activity Feed**: Track platform activities

---

## 🗄️ Database Schema Reference

### User Model

```prisma
model User {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  email    String   @unique
  password String
  phone    String
  role     Role     // CLIENT | PROVIDER | ADMIN
  verified Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### AdminProfile Model

```prisma
model AdminProfile {
  id     String    @id @default(auto()) @map("_id") @db.ObjectId
  role   AdminRole // SUPER | FINANCE | KYC | SUPPORT
  user   User      @relation(fields: [userId], references: [id])
  userId String    @unique @db.ObjectId
}
```

### AdminRole Enum

```prisma
enum AdminRole {
  SUPER    // Full access to all features
  FINANCE  // Access to financial/payout features
  KYC      // Access to user verification features
  SUPPORT  // Access to support/customer service features
}
```

---

## 🔄 Re-seed Database

If you need to reset the database with fresh test data:

```bash
cd backend
npm run seed
```

This will:

1. Clear all existing data
2. Create fresh test users (1 admin, 1 client, 2 providers)
3. Create sample services
4. Display credentials in the console

---

## 🎯 Testing Admin Features

### Test Login Routing:

1. Login with `admin@bluecollar.com`
2. Verify redirect to `/dashboard/admin`
3. Check admin dashboard loads correctly

### Test Different Roles:

1. Logout
2. Login with `client@test.com` → redirects to `/dashboard/client`
3. Login with `provider1@test.com` → redirects to `/dashboard/provider`
4. Login with `admin@bluecollar.com` → redirects to `/dashboard/admin`

### Test Admin Actions:

- View all users in the system
- Manage services (approve/reject)
- Monitor bookings and analytics
- Process provider payouts

---

## 📝 Notes

- **Password**: All test accounts use `password123` (hashed with bcrypt)
- **Verified**: All test accounts are pre-verified
- **Role-based Routing**: Automatic based on user role after login
- **Admin Types**: SUPER has full access, others have specific permissions
- **Database**: MongoDB Atlas (bluecolor database)

---

## 🔧 Troubleshooting

### Can't login as admin?

1. Make sure you ran the seed: `npm run seed`
2. Check backend is running on port 4001
3. Verify MongoDB connection is working
4. Check browser console for errors

### Admin dashboard not loading?

1. Clear browser cache
2. Check that admin routes exist in `frontend/app/dashboard/admin/`
3. Verify token is stored in localStorage
4. Check that role is returned from backend API

### Want to create more admins?

Manually in MongoDB or update the seed script to add more admin users with different AdminRole values (SUPER, FINANCE, KYC, SUPPORT).

---

**You're all set to login as admin!** 🎉

Login at: `http://localhost:3000/login`
Email: `admin@bluecollar.com`
Password: `password123`
