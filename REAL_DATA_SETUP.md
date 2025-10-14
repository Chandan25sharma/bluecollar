# BlueCollar Real Data Setup Guide

## 📋 Overview

This guide helps you set up the BlueCollar platform with **real data** instead of mock/test data. The system now includes:

- ✅ **15 Providers** with real Nepal/India locations
- ✅ **18 Clients** spread across major cities
- ✅ **10+ Service Categories** (Plumbing, Electrical, Cleaning, HVAC, etc.)
- ✅ **Location-based matching** with 5km radius filtering
- ✅ **Distance calculations** and sorting
- ✅ **Interactive maps** with real coordinates
- ✅ **Client location visibility** for providers before booking acceptance

## 🌍 Geographic Coverage

### Nepal Locations

- Kathmandu (Thamel, Durbar Marg, New Baneshwor)
- Lalitpur (Patan Dhoka)
- Bhaktapur (Durbar Square)
- Pokhara (Lakeside, Mahendrapul)
- Chitwan (Bharatpur)
- Butwal, Biratnagar

### India Locations

- Delhi (Connaught Place, Karol Bagh)
- Mumbai (Andheri West, Bandra West)
- Bangalore (Koramangala, Whitefield)
- Chennai, Pune, Hyderabad, Kolkata
- Ahmedabad, Jaipur

## 🚀 Quick Setup

### 1. Seed the Database

```bash
cd backend
npm run seed
```

This will create:

- 1 Admin user
- 18 Clients with real locations
- 15 Providers (12 verified, 3 pending)
- 10+ Services across different categories
- Sample bookings with location data

### 2. Start Backend Server

```bash
cd backend
npm run start:dev
```

### 3. Start Frontend

```bash
cd frontend
npm run dev
```

## 🔑 Test Accounts

All accounts use password: `password123`

### Admin Access

- **Email:** admin@bluecollar.com
- **Role:** Super Admin

### Client Accounts

- **Pattern:** client1@bluecollar.com to client18@bluecollar.com
- **Names:** Real Nepal/India names (Hari Prasad Koirala, Shanti Maya Gurung, etc.)

### Provider Accounts

- **Pattern:** provider1@bluecollar.com to provider15@bluecollar.com
- **Names:** Real Nepal names (Ram Bahadur Shrestha, Sita Kumari Maharjan, etc.)
- **Status:** First 12 are verified and active

## 📍 Location Features

### For Clients

1. **Service Discovery:** Only see providers within 5km radius
2. **Distance Display:** See exact distance to each provider
3. **Map Integration:** View provider locations on interactive map
4. **Location Sharing:** Your location is shared with providers upon booking

### For Providers

1. **Client Location:** See client address and distance before accepting
2. **Route Planning:** Direct links to Google Maps for navigation
3. **Service Area:** Only receive requests from nearby clients

## 🛠️ API Endpoints Used

- `GET /services` - Fetch all available services
- `GET /profiles/providers` - Get providers by skill/location
- `GET /profiles/client/me` - Get client profile with location
- `POST /bookings` - Create booking with client location data

## 🔧 Technical Details

### Database Schema

- **ClientProfile:** Includes latitude, longitude, address fields
- **ProviderProfile:** Includes location and verification status
- **Booking:** Stores client location data for each booking
- **Service:** Linked to verified providers only

### Location Calculation

- Uses Haversine formula for accurate distance calculation
- 5km radius filtering for nearby provider matching
- Real-time distance sorting (nearest first)

### Frontend Changes

- Removed all mock data fallbacks
- Real API integration for services and providers
- Enhanced error handling for empty results
- Location-based UI enhancements

## 🧪 Testing Scenarios

### Test Location-based Matching

1. Login as `client1@bluecollar.com` (Kathmandu location)
2. Browse services - should only see providers in Kathmandu area
3. Book a service - provider will see client's Kathmandu address

### Test Provider Perspective

1. Login as `provider1@bluecollar.com`
2. Check bookings dashboard
3. See client locations and distances before accepting

### Test Distance Filtering

1. Login as different clients from different cities
2. Notice how available providers change based on location
3. Verify 5km radius filtering works correctly

## 🚨 Important Notes

1. **No Mock Data:** System now uses only real database data
2. **Authentication Required:** All features require user login
3. **Location Dependency:** Features work best with location data
4. **Real Coordinates:** All locations use actual latitude/longitude
5. **Production Ready:** Suitable for live deployment

## 🔍 Troubleshooting

### No Providers Found

- Check if providers exist in database: `npm run seed`
- Verify provider verification status
- Ensure client has location data

### Services Not Loading

- Check backend server is running on correct port
- Verify database connection
- Check authentication status

### Location Issues

- Ensure client profiles have latitude/longitude
- Check distance calculation logic
- Verify 5km radius filtering

## 📞 Support

If you encounter issues:

1. Check browser console for API errors
2. Verify backend server logs
3. Ensure database is properly seeded
4. Test with provided credentials

## 🎯 Next Steps

The system is now ready for:

- Production deployment
- Real user registration
- Additional service categories
- Extended geographic coverage
- Advanced location features

---

**Note:** This setup provides a comprehensive foundation with real data that can be expanded as needed for production use.
