# BlueCollar Freelancer Platform

A comprehensive platform connecting clients with verified blue-collar service providers (electricians, plumbers, carpenters, etc.).

## 🚀 Quick Setup Guide

### Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** ([Download here](https://git-scm.com/))
- **Supabase account** (free at [supabase.com](https://supabase.com))

### 📋 Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/bluecollar.git
cd bluecollar
```

#### 2. Install Dependencies

```bash
# Install all dependencies for both frontend and backend
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Go back to root
cd ..
```

#### 3. Setup Supabase Database

**3.1. Create Supabase Project:**

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose organization and fill details:
   - Name: `bluecollar-freelancer`
   - Database Password: Choose a strong password (save this!)
   - Region: Choose closest to your location
4. Click "Create new project" (takes 1-2 minutes)

**3.2. Get Your Credentials:**

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **Project API Keys** → **anon public**: `eyJ...`

**3.3. Get Database Connection String:**

1. Go to **Settings** → **Database**
2. Scroll down to **Connection string** → **URI**
3. Copy the connection string (it includes your password)

#### 4. Configure Environment Variables

**4.1. Backend Configuration:**

Create/update `backend/.env`:

```bash
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.your-project-ref.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.your-project-ref.supabase.co:5432/postgres"

# Supabase Configuration
SUPABASE_URL="https://your-project-ref.supabase.co"
SUPABASE_ANON_KEY="your_anon_key_here"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here_change_in_production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4001
NODE_ENV=development
```

**4.2. Frontend Configuration:**

Create `frontend/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4001/api

# Supabase Configuration (Frontend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### 5. Setup Database

```bash
# Go to backend directory
cd backend

# Generate Prisma client
npx prisma generate

# Run database migrations (creates all tables)
npx prisma migrate dev --name init

# Seed database with test users (optional)
npx prisma db seed

# Go back to root
cd ..
```

#### 6. Start the Application

**Option 1: Start both servers together (Recommended)**

```bash
# From root directory
npm run dev

# This starts:
# - Backend: http://localhost:4001/api
# - Frontend: http://localhost:3000 (or next available port)
```

**Option 2: Start servers individually**

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### 7. Test the Setup

1. **Frontend**: Open [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)
2. **Backend API**: Test [http://localhost:4001/api/auth/verify-token](http://localhost:4001/api/auth/verify-token)
3. **Database**: Check Supabase dashboard for created tables

### 🔑 Test Users (after seeding)

The database includes these test accounts:

- **Admin**: `admin@bluecollar.local` / `admin123`
- **Provider**: `provider@bluecollar.local` / `provider123`
- **Client**: `client@bluecollar.local` / `client123`

## Project Structure

```
bluecollar/
├── frontend/                 # Next.js 14 App (Port 3000)
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable components
│   │   └── styles/          # Global styles
│   └── package.json
├── backend/                  # NestJS API (Port 4001)
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── prisma/          # Database service
│   │   └── main.ts          # Entry point
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Test data
│   └── package.json
├── .env.example             # Environment template
└── README.md
```

# Or individually:

npm run dev:frontend # http://localhost:3000
npm run dev:backend # http://localhost:4001/api

```

## Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (API client)

### Backend
- **NestJS**
- **Prisma ORM**
- **Supabase (PostgreSQL)**
- **JWT Authentication**
- **bcrypt** (Password hashing)

### Database
- **Supabase PostgreSQL**
- **Prisma** (ORM & Migrations)

## Environment Variables

See `.env.example` for required environment variables.

## Documentation

- [API Documentation](./docs/api-spec.md)
- [Database Schema](./docs/db-schema.md)

## Features

- ✅ User Authentication (JWT)
- ✅ Role-based Access (Client/Provider/Admin)
- 🔄 Service Listings
- 🔄 Booking System
- 🔄 Payment Integration (Escrow)
- 🔄 Review System
- 🔄 Admin Dashboard

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- More endpoints coming...

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

```
