# Database Schema

## Overview
The BlueCollar Freelancer platform uses PostgreSQL as the primary database with Prisma as the ORM.

## Tables

### users
Stores user information for clients, providers, and admins.

| Column     | Type      | Constraints                    | Description                 |
|------------|-----------|--------------------------------|-----------------------------|
| id         | INT       | PRIMARY KEY, AUTO_INCREMENT    | Unique user identifier      |
| name       | STRING    | NOT NULL                       | User's full name            |
| email      | STRING    | UNIQUE, NOT NULL               | User's email address        |
| phone      | STRING    | NULLABLE                       | User's phone number         |
| password   | STRING    | NOT NULL                       | Hashed password             |
| role       | ENUM      | DEFAULT 'CLIENT'               | CLIENT, PROVIDER, ADMIN     |
| verified   | BOOLEAN   | DEFAULT false                  | Email verification status   |
| createdAt  | DATETIME  | DEFAULT now()                  | Account creation timestamp  |
| updatedAt  | DATETIME  | AUTO_UPDATE                    | Last update timestamp       |

### services
Service listings created by providers.

| Column      | Type      | Constraints                    | Description                 |
|-------------|-----------|--------------------------------|-----------------------------|
| id          | INT       | PRIMARY KEY, AUTO_INCREMENT    | Unique service identifier   |
| title       | STRING    | NOT NULL                       | Service title               |
| description | TEXT      | NULLABLE                       | Service description         |
| price       | FLOAT     | NOT NULL                       | Service price per hour/job  |
| category    | ENUM      | NOT NULL                       | Service category            |
| location    | STRING    | NULLABLE                       | Service location            |
| isActive    | BOOLEAN   | DEFAULT true                   | Service availability        |
| providerId  | INT       | FOREIGN KEY → users.id         | Service provider            |
| createdAt   | DATETIME  | DEFAULT now()                  | Creation timestamp          |
| updatedAt   | DATETIME  | AUTO_UPDATE                    | Last update timestamp       |

### bookings
Service bookings between clients and providers.

| Column      | Type      | Constraints                    | Description                 |
|-------------|-----------|--------------------------------|-----------------------------|
| id          | INT       | PRIMARY KEY, AUTO_INCREMENT    | Unique booking identifier   |
| scheduledAt | DATETIME  | NOT NULL                       | Scheduled service time      |
| completedAt | DATETIME  | NULLABLE                       | Actual completion time      |
| totalAmount | FLOAT     | NOT NULL                       | Total booking amount        |
| status      | ENUM      | DEFAULT 'PENDING'              | Booking status              |
| notes       | TEXT      | NULLABLE                       | Additional notes            |
| serviceId   | INT       | FOREIGN KEY → services.id      | Booked service              |
| clientId    | INT       | FOREIGN KEY → users.id         | Client who booked           |
| providerId  | INT       | FOREIGN KEY → users.id         | Service provider            |
| createdAt   | DATETIME  | DEFAULT now()                  | Booking creation time       |
| updatedAt   | DATETIME  | AUTO_UPDATE                    | Last update timestamp       |

### reviews
Reviews and ratings for completed services.

| Column     | Type      | Constraints                    | Description                 |
|------------|-----------|--------------------------------|-----------------------------|
| id         | INT       | PRIMARY KEY, AUTO_INCREMENT    | Unique review identifier    |
| rating     | INT       | NOT NULL, CHECK (1-5)          | Star rating (1-5)           |
| comment    | TEXT      | NULLABLE                       | Review comment              |
| bookingId  | INT       | FOREIGN KEY → bookings.id      | Related booking             |
| serviceId  | INT       | FOREIGN KEY → services.id      | Reviewed service            |
| reviewerId | INT       | FOREIGN KEY → users.id         | User who wrote review       |
| revieweeId | INT       | FOREIGN KEY → users.id         | User being reviewed         |
| createdAt  | DATETIME  | DEFAULT now()                  | Review creation time        |
| updatedAt  | DATETIME  | AUTO_UPDATE                    | Last update timestamp       |

## Enums

### Role
- `CLIENT` - Users who book services
- `PROVIDER` - Users who offer services
- `ADMIN` - Platform administrators

### BookingStatus
- `PENDING` - Booking created, awaiting provider acceptance
- `ACCEPTED` - Provider accepted the booking
- `COMPLETED` - Service completed successfully
- `CANCELLED` - Booking cancelled by either party
- `REFUNDED` - Payment refunded to client

### ServiceCategory
- `ELECTRICAL` - Electrical services
- `PLUMBING` - Plumbing services
- `CARPENTRY` - Carpentry and woodwork
- `PAINTING` - Painting and decorating
- `CLEANING` - Cleaning services
- `HVAC` - Heating, ventilation, air conditioning
- `LANDSCAPING` - Garden and outdoor services
- `HANDYMAN` - General maintenance and repairs
- `OTHER` - Other services not listed

## Relationships

### One-to-Many
- `users` → `services` (One provider can have many services)
- `users` → `bookings` (as client - One client can have many bookings)
- `users` → `bookings` (as provider - One provider can have many bookings)
- `services` → `bookings` (One service can have many bookings)
- `users` → `reviews` (as reviewer - One user can write many reviews)
- `users` → `reviews` (as reviewee - One user can receive many reviews)
- `services` → `reviews` (One service can have many reviews)

### One-to-One
- `bookings` → `reviews` (One booking can have one review)

## Indexes

### Performance Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Service queries
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_provider ON services(providerId);
CREATE INDEX idx_services_active ON services(isActive);

-- Booking queries
CREATE INDEX idx_bookings_client ON bookings(clientId);
CREATE INDEX idx_bookings_provider ON bookings(providerId);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled ON bookings(scheduledAt);

-- Review queries
CREATE INDEX idx_reviews_service ON reviews(serviceId);
CREATE INDEX idx_reviews_reviewee ON reviews(revieweeId);
```

## Constraints

### Foreign Key Constraints
All foreign key relationships have CASCADE DELETE to maintain referential integrity.

### Check Constraints
- `reviews.rating` must be between 1 and 5
- `users.email` must be a valid email format
- `services.price` must be positive

## Migration History

### Initial Migration (001_init)
- Created all base tables
- Added enums
- Set up foreign key relationships
- Added basic indexes

## Sample Data

See `prisma/seed.ts` for sample data creation script.

## Backup Strategy

### Development
- Local PostgreSQL with daily dumps
- Schema versioning through Prisma migrations

### Production (Future)
- Automated daily backups
- Point-in-time recovery
- Read replicas for analytics
