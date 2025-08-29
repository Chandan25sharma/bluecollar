# BlueCollar Freelancer Platform

A comprehensive platform connecting clients with verified blue-collar service providers (electricians, plumbers, carpenters, etc.).


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

### Test Users (after seeding)

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

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Axios** (API client)
- **Supabase Client**

### Backend
- **NestJS** (Node.js framework)
- **Prisma ORM** (Database toolkit)
- **Supabase PostgreSQL** (Database)
- **JWT Authentication**
- **bcrypt** (Password hashing)
- **Passport.js** (Authentication middleware)

### Database
- **Supabase PostgreSQL** (Cloud database)
- **Prisma** (ORM & Migrations)

## Available Scripts

### Root Directory
```bash
npm run dev              # Start both frontend & backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm install             # Install all dependencies
```

### Backend (`cd backend`)
```bash
npm run start:dev       # Start in development mode
npm run build          # Build for production
npx prisma generate    # Generate Prisma client
npx prisma migrate dev # Create and apply migration
npx prisma studio      # Open Prisma Studio (database GUI)
npx prisma db seed     # Seed database with test data
```

### Frontend (`cd frontend`)
```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run start          # Start production server
```

## 🔧 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process on port 4001 (backend)
npx kill-port 4001

# Kill process on port 3000 (frontend)  
npx kill-port 3000
```

**2. Database Connection Errors**
- Verify your DATABASE_URL in `backend/.env`
- Check your Supabase project is active
- Ensure password doesn't contain special characters that need URL encoding

**3. Prisma Client Errors**
```bash
cd backend
npx prisma generate
npx prisma db push
```

**4. Frontend Build Errors**
```bash
cd frontend
rm -rf .next
npm run dev
```

**5. Environment Variables Not Loading**
- Ensure `.env` files are in correct directories
- Restart servers after changing environment variables
- Check for typos in variable names

### Reset Everything
```bash
# Reset database
cd backend
npx prisma migrate reset

# Clean install
cd ..
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd backend && npm install
cd ../frontend && npm install
```

##  API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login  
- `GET /api/auth/me` - Get current user profile
- `GET /api/auth/verify-token` - Verify JWT token

### Future Endpoints (Coming Soon)
- `GET /api/services` - List all services
- `POST /api/services` - Create new service
- `GET /api/bookings` - User bookings
- `POST /api/bookings` - Create booking

##  Features Status

- ✅ **User Authentication** (Signup/Login/JWT)
- ✅ **Role-based Access** (Client/Provider/Admin)
- ✅ **Database Schema** (Users/Services/Bookings/Reviews)
- ✅ **Responsive UI** (Landing page, Auth pages)
- 🔄 **Service Listings** (In Progress)
- 🔄 **Booking System** (Planned)
- 🔄 **Payment Integration** (Planned)
- 🔄 **Review System** (Planned)
- 🔄 **Admin Dashboard** (Planned)

##  Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License.

##  Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure Supabase project is properly configured
4. Create an issue on GitHub with detailed error information

---

**Happy Coding! **

