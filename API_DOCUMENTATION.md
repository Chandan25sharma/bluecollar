# 🚀 BlueCollar API Documentation

## Production URL
**Base URL**: `https://blue.coderspace.com/api`

## Quick Health Check
Test if the API is running:
```bash
curl https://blue.coderspace.com/api
```

Expected response:
```json
{
  "message": "BlueCollar API is healthy",
  "status": "ok",
  "timestamp": "2025-10-23T..."
}
```

## 📋 Available Endpoints

### 🔧 Health & Status
- `GET /api` - Main API health check
- `GET /api/health` - Detailed health status

### 🔐 Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### 🛠️ Services
- `GET /api/services` - Get all services (with filters)
- `POST /api/services` - Create new service (provider only)
- `GET /api/services/:id` - Get specific service
- `PUT /api/services/:id` - Update service (provider only)
- `DELETE /api/services/:id` - Delete service (provider only)

### 📅 Bookings
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id` - Update booking status

### 👤 Profiles
- `GET /api/profiles` - Get user profiles
- `POST /api/profiles` - Create profile
- `PUT /api/profiles/:id` - Update profile

### 💳 Payments
- `POST /api/payments` - Process payment
- `GET /api/payments/:id` - Get payment details
- `POST /api/payments/verify` - Verify payment

### 🔔 Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Send notification

### 🏠 Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### 👑 Admin (Admin only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/services` - All services
- `PUT /api/admin/approve/:id` - Approve provider

## 🌐 Frontend Integration

Your frontend is now configured to use the production API:
```env
NEXT_PUBLIC_API_URL=https://blue.coderspace.com/api
```

## 🔒 Authentication Headers

For protected endpoints, include JWT token:
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

## 📱 Example API Calls

### Get All Services
```javascript
fetch('https://blue.coderspace.com/api/services')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Create Booking
```javascript
fetch('https://blue.coderspace.com/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    serviceId: 'service-id',
    scheduledDate: '2025-10-24T10:00:00Z',
    notes: 'Special requirements'
  })
});
```

## 🚨 Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your domain is in the allowed origins
2. **401 Unauthorized**: Check JWT token is valid and included
3. **404 Not Found**: Verify endpoint URL and method
4. **500 Server Error**: Check server logs in Railway dashboard

### Debug Commands:
```bash
# Test API health
curl https://blue.coderspace.com/api

# Test with authentication
curl -H "Authorization: Bearer YOUR_TOKEN" https://blue.coderspace.com/api/services
```

## 🛡️ Security Features
- ✅ CORS protection for specific domains
- ✅ JWT authentication for protected routes
- ✅ Input validation on all endpoints
- ✅ Rate limiting (Railway provides)
- ✅ HTTPS encryption (Railway provides)

## 📊 Environment Variables
Required for backend deployment:
- `DATABASE_URL` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `PORT` - Server port (Railway auto-sets)