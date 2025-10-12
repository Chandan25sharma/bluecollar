# BlueCollar Database Schema & Collections

## Database Information

- **Database Type**: MongoDB Atlas
- **Database Name**: `bluecollar_db`
- **Total Collections**: 9 main collections + system collections

---

## 1. User Collection (`User`)

**Collection Name**: `User`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "email": "String (unique)",
  "password": "String (hashed)",
  "phone": "String (unique)",
  "role": "CLIENT | PROVIDER | ADMIN",
  "verified": "Boolean (default: false)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f1234567890abcdef12345",
    "email": "admin@bluecollar.com",
    "password": "$2b$10$hashed_password_here",
    "phone": "+1234567890",
    "role": "ADMIN",
    "verified": true,
    "createdAt": "2024-10-01T10:00:00.000Z",
    "updatedAt": "2024-10-01T10:00:00.000Z"
  },
  {
    "_id": "65f1234567890abcdef12346",
    "email": "client@test.com",
    "password": "$2b$10$hashed_password_here",
    "phone": "+1234567891",
    "role": "CLIENT",
    "verified": true,
    "createdAt": "2024-10-02T08:30:00.000Z",
    "updatedAt": "2024-10-02T08:30:00.000Z"
  },
  {
    "_id": "65f1234567890abcdef12347",
    "email": "provider1@test.com",
    "password": "$2b$10$hashed_password_here",
    "phone": "+1234567892",
    "role": "PROVIDER",
    "verified": true,
    "createdAt": "2024-10-03T09:15:00.000Z",
    "updatedAt": "2024-10-03T09:15:00.000Z"
  },
  {
    "_id": "65f1234567890abcdef12348",
    "email": "provider2@test.com",
    "password": "$2b$10$hashed_password_here",
    "phone": "+1234567893",
    "role": "PROVIDER",
    "verified": false,
    "createdAt": "2024-10-04T11:20:00.000Z",
    "updatedAt": "2024-10-04T11:20:00.000Z"
  }
]
```

---

## 2. ClientProfile Collection (`ClientProfile`)

**Collection Name**: `ClientProfile`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "name": "String",
  "age": "Number (optional)",
  "address": "String (primary address)",
  "latitude": "Number (coordinates)",
  "longitude": "Number (coordinates)",
  "city": "String",
  "state": "String",
  "zipCode": "String",
  "userId": "ObjectId (reference to User)"
}
```

### Sample Data

```json
[
  {
    "_id": "65f2234567890abcdef12345",
    "name": "John Smith",
    "age": 32,
    "address": "123 Main St, New York, NY 10001",
    "latitude": 40.7589,
    "longitude": -73.9851,
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "userId": "65f1234567890abcdef12346"
  },
  {
    "_id": "65f2234567890abcdef12346",
    "name": "Sarah Johnson",
    "age": 28,
    "address": "456 Oak Ave, Los Angeles, CA 90210",
    "latitude": 34.0522,
    "longitude": -118.2437,
    "city": "Los Angeles",
    "state": "CA",
    "zipCode": "90210",
    "userId": "65f1234567890abcdef12349"
  }
]
```

---

## 3. ClientAddress Collection (`ClientAddress`)

**Collection Name**: `ClientAddress`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "label": "String (Home, Office, etc.)",
  "address": "String (full address)",
  "latitude": "Number",
  "longitude": "Number",
  "city": "String",
  "state": "String",
  "zipCode": "String",
  "isDefault": "Boolean",
  "clientId": "ObjectId (reference to ClientProfile)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f3234567890abcdef12345",
    "label": "Home",
    "address": "123 Main St, New York, NY 10001",
    "latitude": 40.7589,
    "longitude": -73.9851,
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "isDefault": true,
    "clientId": "65f2234567890abcdef12345",
    "createdAt": "2024-10-02T08:30:00.000Z",
    "updatedAt": "2024-10-02T08:30:00.000Z"
  },
  {
    "_id": "65f3234567890abcdef12346",
    "label": "Office",
    "address": "789 Business Blvd, New York, NY 10005",
    "latitude": 40.7505,
    "longitude": -73.9934,
    "city": "New York",
    "state": "NY",
    "zipCode": "10005",
    "isDefault": false,
    "clientId": "65f2234567890abcdef12345",
    "createdAt": "2024-10-02T09:00:00.000Z",
    "updatedAt": "2024-10-02T09:00:00.000Z"
  }
]
```

---

## 4. ProviderProfile Collection (`ProviderProfile`)

**Collection Name**: `ProviderProfile`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "name": "String",
  "skills": ["String Array"],
  "rate": "Number (hourly rate)",
  "verified": "Boolean",
  "verificationStatus": "PENDING | APPROVED | REJECTED | RESUBMITTED",
  "rejectionReason": "String (optional)",
  "bankName": "String",
  "bankAcc": "String",
  "govIdUrl": "String (document URL)",
  "businessLicenseUrl": "String (document URL)",
  "insuranceDocUrl": "String (document URL)",
  "certificationUrls": ["String Array"],
  "address": "String",
  "latitude": "Number",
  "longitude": "Number",
  "city": "String",
  "state": "String",
  "zipCode": "String",
  "verifiedAt": "DateTime (optional)",
  "verifiedBy": "ObjectId (admin ID)",
  "userId": "ObjectId (reference to User)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f4234567890abcdef12345",
    "name": "Mike Wilson",
    "skills": ["Plumbing", "Water Heater Repair", "Leak Fixing"],
    "rate": 75.0,
    "verified": true,
    "verificationStatus": "APPROVED",
    "rejectionReason": null,
    "bankName": "Chase Bank",
    "bankAcc": "****1234",
    "govIdUrl": "https://storage.com/docs/gov_id_mike.pdf",
    "businessLicenseUrl": "https://storage.com/docs/license_mike.pdf",
    "insuranceDocUrl": "https://storage.com/docs/insurance_mike.pdf",
    "certificationUrls": ["https://storage.com/docs/cert1_mike.pdf"],
    "address": "321 Service St, Brooklyn, NY 11201",
    "latitude": 40.6892,
    "longitude": -73.9442,
    "city": "Brooklyn",
    "state": "NY",
    "zipCode": "11201",
    "verifiedAt": "2024-10-05T14:30:00.000Z",
    "verifiedBy": "65f1234567890abcdef12345",
    "userId": "65f1234567890abcdef12347",
    "createdAt": "2024-10-03T09:15:00.000Z",
    "updatedAt": "2024-10-05T14:30:00.000Z"
  },
  {
    "_id": "65f4234567890abcdef12346",
    "name": "Lisa Garcia",
    "skills": ["Electrical Work", "Wiring", "Panel Installation"],
    "rate": 85.0,
    "verified": false,
    "verificationStatus": "PENDING",
    "rejectionReason": null,
    "bankName": "Wells Fargo",
    "bankAcc": "****5678",
    "govIdUrl": "https://storage.com/docs/gov_id_lisa.pdf",
    "businessLicenseUrl": "https://storage.com/docs/license_lisa.pdf",
    "insuranceDocUrl": null,
    "certificationUrls": [],
    "address": "654 Electric Ave, Queens, NY 11375",
    "latitude": 40.7282,
    "longitude": -73.837,
    "city": "Queens",
    "state": "NY",
    "zipCode": "11375",
    "verifiedAt": null,
    "verifiedBy": null,
    "userId": "65f1234567890abcdef12348",
    "createdAt": "2024-10-04T11:20:00.000Z",
    "updatedAt": "2024-10-04T11:20:00.000Z"
  }
]
```

---

## 5. AdminProfile Collection (`AdminProfile`)

**Collection Name**: `AdminProfile`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "role": "SUPER | FINANCE | KYC | SUPPORT",
  "userId": "ObjectId (reference to User)"
}
```

### Sample Data

```json
[
  {
    "_id": "65f5234567890abcdef12345",
    "role": "SUPER",
    "userId": "65f1234567890abcdef12345"
  }
]
```

---

## 6. Service Collection (`Service`)

**Collection Name**: `Service`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "title": "String",
  "description": "String",
  "price": "Number",
  "category": "String",
  "duration": "String",
  "isActive": "Boolean",
  "providerId": "ObjectId (reference to ProviderProfile)",
  "createdAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f6234567890abcdef12345",
    "title": "Emergency Plumbing Repair",
    "description": "Quick response plumbing repair for leaks, clogs, and emergency situations",
    "price": 150.0,
    "category": "Plumbing",
    "duration": "2-3 hours",
    "isActive": true,
    "providerId": "65f4234567890abcdef12345",
    "createdAt": "2024-10-05T15:00:00.000Z"
  },
  {
    "_id": "65f6234567890abcdef12346",
    "title": "Water Heater Installation",
    "description": "Professional water heater installation and setup",
    "price": 450.0,
    "category": "Plumbing",
    "duration": "4-6 hours",
    "isActive": true,
    "providerId": "65f4234567890abcdef12345",
    "createdAt": "2024-10-05T15:15:00.000Z"
  },
  {
    "_id": "65f6234567890abcdef12347",
    "title": "Electrical Panel Upgrade",
    "description": "Upgrade old electrical panels to modern standards",
    "price": 800.0,
    "category": "Electrical",
    "duration": "6-8 hours",
    "isActive": true,
    "providerId": "65f4234567890abcdef12346",
    "createdAt": "2024-10-04T12:00:00.000Z"
  },
  {
    "_id": "65f6234567890abcdef12348",
    "title": "Home Electrical Inspection",
    "description": "Complete electrical system inspection and safety check",
    "price": 200.0,
    "category": "Electrical",
    "duration": "2-3 hours",
    "isActive": true,
    "providerId": "65f4234567890abcdef12346",
    "createdAt": "2024-10-04T12:30:00.000Z"
  }
]
```

---

## 7. Booking Collection (`Booking`)

**Collection Name**: `Booking`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "status": "PENDING | ACCEPTED | COMPLETED | CANCELLED",
  "date": "DateTime",
  "notes": "String (optional)",
  "totalAmount": "Number",
  "distance": "Number (km)",
  "clientAddress": "String",
  "clientLatitude": "Number",
  "clientLongitude": "Number",
  "clientId": "ObjectId (reference to ClientProfile)",
  "providerId": "ObjectId (reference to ProviderProfile)",
  "serviceId": "ObjectId (reference to Service)",
  "createdAt": "DateTime",
  "updatedAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f7234567890abcdef12345",
    "status": "COMPLETED",
    "date": "2024-10-08T14:00:00.000Z",
    "notes": "Kitchen sink leak repair",
    "totalAmount": 150.0,
    "distance": 5.2,
    "clientAddress": "123 Main St, New York, NY 10001",
    "clientLatitude": 40.7589,
    "clientLongitude": -73.9851,
    "clientId": "65f2234567890abcdef12345",
    "providerId": "65f4234567890abcdef12345",
    "serviceId": "65f6234567890abcdef12345",
    "createdAt": "2024-10-07T10:30:00.000Z",
    "updatedAt": "2024-10-08T16:00:00.000Z"
  },
  {
    "_id": "65f7234567890abcdef12346",
    "status": "PENDING",
    "date": "2024-10-12T10:00:00.000Z",
    "notes": "Water heater not working",
    "totalAmount": 450.0,
    "distance": 3.8,
    "clientAddress": "456 Oak Ave, Los Angeles, CA 90210",
    "clientLatitude": 34.0522,
    "clientLongitude": -118.2437,
    "clientId": "65f2234567890abcdef12346",
    "providerId": "65f4234567890abcdef12345",
    "serviceId": "65f6234567890abcdef12346",
    "createdAt": "2024-10-09T09:00:00.000Z",
    "updatedAt": "2024-10-09T09:00:00.000Z"
  }
]
```

---

## 8. Payment Collection (`Payment`)

**Collection Name**: `Payment`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "amount": "Number",
  "commission": "Number",
  "status": "String (PENDING, COMPLETED, FAILED)",
  "method": "String (CASH, CARD, etc.)",
  "bookingId": "ObjectId (reference to Booking)",
  "createdAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f8234567890abcdef12345",
    "amount": 150.0,
    "commission": 15.0,
    "status": "COMPLETED",
    "method": "CASH",
    "bookingId": "65f7234567890abcdef12345",
    "createdAt": "2024-10-08T16:00:00.000Z"
  }
]
```

---

## 9. Review Collection (`Review`)

**Collection Name**: `Review`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "rating": "Number (1-5)",
  "comment": "String (optional)",
  "helpful": "Number (default: 0)",
  "clientId": "ObjectId (reference to ClientProfile)",
  "providerId": "ObjectId (reference to ProviderProfile)",
  "bookingId": "ObjectId (reference to Booking)",
  "createdAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65f9234567890abcdef12345",
    "rating": 5,
    "comment": "Excellent work! Mike fixed my kitchen sink leak quickly and professionally.",
    "helpful": 3,
    "clientId": "65f2234567890abcdef12345",
    "providerId": "65f4234567890abcdef12345",
    "bookingId": "65f7234567890abcdef12345",
    "createdAt": "2024-10-08T17:00:00.000Z"
  },
  {
    "_id": "65f9234567890abcdef12346",
    "rating": 4,
    "comment": "Good service, arrived on time and got the job done.",
    "helpful": 1,
    "clientId": "65f2234567890abcdef12346",
    "providerId": "65f4234567890abcdef12345",
    "bookingId": null,
    "createdAt": "2024-09-28T14:30:00.000Z"
  }
]
```

---

## 10. Payout Collection (`Payout`)

**Collection Name**: `Payout`

### Schema Structure

```json
{
  "_id": "ObjectId",
  "amount": "Number",
  "status": "String (PENDING, COMPLETED, FAILED)",
  "providerId": "ObjectId (reference to ProviderProfile)",
  "createdAt": "DateTime"
}
```

### Sample Data

```json
[
  {
    "_id": "65fa234567890abcdef12345",
    "amount": 135.0,
    "status": "COMPLETED",
    "providerId": "65f4234567890abcdef12345",
    "createdAt": "2024-10-09T10:00:00.000Z"
  }
]
```

---

## Database Setup Commands

### 1. MongoDB Atlas Setup

```bash
# Database URL format
mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
```

### 2. Prisma Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed database (if seed file exists)
npx prisma db seed
```

### 3. Collection Indexes (Recommended)

```javascript
// In MongoDB Compass or mongosh

// User collection indexes
db.User.createIndex({ email: 1 }, { unique: true });
db.User.createIndex({ phone: 1 }, { unique: true });
db.User.createIndex({ role: 1 });

// ProviderProfile collection indexes
db.ProviderProfile.createIndex({ verificationStatus: 1 });
db.ProviderProfile.createIndex({ city: 1 });
db.ProviderProfile.createIndex({ skills: 1 });
db.ProviderProfile.createIndex({ verified: 1 });

// Service collection indexes
db.Service.createIndex({ category: 1 });
db.Service.createIndex({ isActive: 1 });
db.Service.createIndex({ providerId: 1 });

// Booking collection indexes
db.Booking.createIndex({ status: 1 });
db.Booking.createIndex({ clientId: 1 });
db.Booking.createIndex({ providerId: 1 });
db.Booking.createIndex({ date: 1 });

// Geospatial indexes for location-based queries
db.ProviderProfile.createIndex({ latitude: 1, longitude: 1 });
db.ClientProfile.createIndex({ latitude: 1, longitude: 1 });
db.ClientAddress.createIndex({ latitude: 1, longitude: 1 });
```

---

## Summary

- **Total Collections**: 10 main collections
- **Key Features**:

  - Provider verification workflow with document uploads
  - Multi-address support for clients
  - Location-based service matching
  - Complete booking and payment tracking
  - Review and rating system
  - Admin management system

- **Important Notes**:
  - All ObjectIds must be valid MongoDB ObjectIds
  - Passwords should be bcrypt hashed
  - Document URLs should point to actual file storage
  - Coordinates should be valid latitude/longitude values
  - All DateTime fields use ISO 8601 format

This schema supports the complete BlueCollar platform workflow from user registration to service completion and payment processing.
