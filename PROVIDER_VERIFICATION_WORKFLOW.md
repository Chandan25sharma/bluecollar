# Provider Verification Workflow Implementation

## 🎯 Overview

This document outlines the complete provider verification workflow where:
1. **Provider Signup** → Submits documents during registration
2. **Admin Review** → Admin verifies documents and approves/rejects
3. **Profile Visibility** → Only APPROVED providers appear in client search

---

## 📋 Database Schema Changes

### ProviderProfile Model (Updated)

```prisma
model ProviderProfile {
  id                 String                @id @default(auto()) @map("_id") @db.ObjectId
  name               String
  skills             String[]
  rate               Float
  verified           Boolean               @default(false)
  verificationStatus VerificationStatus    @default(PENDING)
  rejectionReason    String?               // Why admin rejected
  
  // Document URLs
  govIdUrl           String?               // Government ID
  businessLicenseUrl String?               // Business license
  insuranceDocUrl    String?               // Insurance certificate
  certificationUrls  String[]              @default([]) // Professional certs
  
  // Location
  address            String?
  latitude           Float?
  longitude          Float?
  city               String?
  state              String?
  zipCode            String?
  
  // Verification tracking
  verifiedAt         DateTime?             // When approved
  verifiedBy         String?               @db.ObjectId // Admin ID
  
  // Relations
  user               User                  @relation(fields: [userId], references: [id])
  userId             String                @unique @db.ObjectId
  services           Service[]
  bookings           Booking[]
  reviews            Review[]
  payouts            Payout[]
  
  createdAt          DateTime              @default(now())
  updatedAt          DateTime              @updatedAt
}

enum VerificationStatus {
  PENDING        // Initial state - waiting for admin review
  APPROVED       // Admin approved - profile visible to clients
  REJECTED       // Admin rejected - needs document resubmission
  RESUBMITTED    // Provider uploaded new docs after rejection
}
```

---

## 🔧 Backend Implementation

### 1. Admin Controller (`admin.controller.ts`)

New endpoints added:

```typescript
// Get all providers pending verification
@Get('providers/pending')
async getPendingProviders()

// Get detailed provider info for review
@Get('providers/:id')
async getProviderDetails(@Param('id') id: string)

// Approve or reject provider
@Patch('providers/:id/verify')
async verifyProvider(
  @Param('id') id: string,
  @Body() body: { 
    adminId: string; 
    approved: boolean; 
    reason?: string // Required if rejected
  }
)
```

### 2. Admin Service (`admin.service.ts`)

```typescript
// Get providers with PENDING or RESUBMITTED status
async getPendingProviders(): Promise<ProviderProfile[]>

// Get full provider details including documents
async getProviderDetails(id: string): Promise<ProviderProfile>

// Approve or reject provider verification
async verifyProvider(
  providerId: string,
  adminId: string,
  approved: boolean,
  reason?: string
): Promise<{ success: boolean; provider: ProviderProfile; message: string }>
```

### 3. Services Filter (`services.service.ts`)

Updated to show only APPROVED providers to clients:

```typescript
async getAllServices(filters) {
  const where: any = {
    provider: {
      verified: true,
      verificationStatus: 'APPROVED', // ← Only show approved
    },
  };
  // ... rest of filters
}
```

---

## 🎨 Frontend Implementation

### 1. Provider Signup Flow

**File**: `frontend/app/(auth)/provider-signup/page.tsx`

**Features**:
- Document upload fields:
  - Government ID (required)
  - Business License (required)
  - Insurance Document (optional)
  - Professional Certifications (optional)
- File validation (PDF, JPG, PNG, max 5MB)
- Upload to cloud storage (Cloudinary/AWS S3)
- Store URLs in database

**After Signup**:
- verificationStatus = PENDING
- Provider can login but cannot create services
- Show "Pending Verification" banner on dashboard

### 2. Admin Verification Dashboard

**File**: `frontend/app/dashboard/admin/providers/pending/page.tsx`

**Features**:
- List all pending providers
- Show submission date (oldest first)
- Quick actions: View Details, Approve, Reject

**UI Components**:
```tsx
<PendingProvidersTable>
  - Provider Name
  - Email
  - Submitted Date
  - Documents Status
  - Actions (View/Approve/Reject)
</PendingProvidersTable>
```

### 3. Provider Details Modal

**File**: `frontend/app/dashboard/admin/providers/[id]/page.tsx`

**Features**:
- Personal Information:
  - Name, Email, Phone
  - Address, Location
  - Skills, Hourly Rate
  
- Documents Preview:
  - Government ID (with preview)
  - Business License (with preview)
  - Insurance Doc (with preview)
  - Certifications (list with preview)

- Action Buttons:
  - ✅ Approve Provider
  - ❌ Reject with Reason

**Approve Action**:
```typescript
await adminAPI.verifyProvider(providerId, {
  adminId: currentAdminId,
  approved: true
});
// Updates verificationStatus to APPROVED
// Provider profile now visible to clients
```

**Reject Action**:
```typescript
await adminAPI.verifyProvider(providerId, {
  adminId: currentAdminId,
  approved: false,
  reason: "Business license expired. Please upload current license."
});
// Updates verificationStatus to REJECTED
// Provider receives rejection reason
// Can resubmit documents
```

### 4. Provider Dashboard Status Banner

**File**: `frontend/app/dashboard/provider/page.tsx`

**Status Messages**:

**PENDING**:
```tsx
<Banner type="warning">
  ⏳ Your account is under review. 
  You'll be notified once verified by our team.
  Estimated review time: 24-48 hours.
</Banner>
```

**APPROVED**:
```tsx
<Banner type="success">
  ✅ Your account is verified! 
  You can now create services and accept bookings.
</Banner>
```

**REJECTED**:
```tsx
<Banner type="error">
  ❌ Verification failed: {rejectionReason}
  <Button>Resubmit Documents</Button>
</Banner>
```

---

## 🔐 Access Control Rules

### Provider Permissions by Status

| Status | Can Login | Can Create Services | Visible to Clients | Can Accept Bookings |
|--------|-----------|---------------------|-------------------|---------------------|
| PENDING | ✅ Yes | ❌ No | ❌ No | ❌ No |
| APPROVED | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| REJECTED | ✅ Yes | ❌ No | ❌ No | ❌ No |
| RESUBMITTED | ✅ Yes | ❌ No | ❌ No | ❌ No |

### Service Creation Guard

```typescript
// In services.controller.ts
@Post()
async createService(@Body() dto: CreateServiceDto, @User() user) {
  const provider = await this.prisma.providerProfile.findUnique({
    where: { userId: user.id }
  });
  
  if (provider.verificationStatus !== 'APPROVED') {
    throw new ForbiddenException(
      'Your account must be verified before creating services'
    );
  }
  
  // Create service...
}
```

---

## 📧 Notification System (Future Enhancement)

### Email Templates

**On Signup**:
```
Subject: Welcome to BlueCollar - Verification Pending

Hi {providerName},

Thank you for registering! Your account is currently under review.

Our team will verify your documents within 24-48 hours.

You'll receive an email once your account is approved.

Best regards,
BlueCollar Team
```

**On Approval**:
```
Subject: Account Approved - Start Offering Services!

Hi {providerName},

Great news! Your account has been approved.

You can now:
✅ Create services
✅ Accept bookings
✅ Appear in client searches

Get started: {dashboardLink}

Best regards,
BlueCollar Team
```

**On Rejection**:
```
Subject: Additional Documents Required

Hi {providerName},

We need additional information to verify your account.

Reason: {rejectionReason}

Please resubmit the required documents at: {resubmitLink}

Our team will review your submission within 24 hours.

Best regards,
BlueCollar Team
```

---

## 🧪 Testing Workflow

### Test Scenario 1: New Provider Signup

1. Go to `/provider-signup`
2. Fill in all fields
3. Upload documents:
   - Government ID: `test_govt_id.pdf`
   - Business License: `test_license.pdf`
4. Submit form
5. Check database: `verificationStatus = PENDING`
6. Login as provider → See "Pending Verification" banner
7. Try to create service → Get error message

### Test Scenario 2: Admin Approves Provider

1. Login as admin (`admin@bluecollar.com`)
2. Go to `/dashboard/admin/providers/pending`
3. See new provider in list
4. Click "View Details"
5. Review documents
6. Click "Approve"
7. Check database: `verificationStatus = APPROVED`, `verifiedAt = NOW()`
8. Provider receives email notification
9. Provider can now create services

### Test Scenario 3: Admin Rejects Provider

1. Admin views provider details
2. Click "Reject"
3. Enter reason: "Expired business license"
4. Submit rejection
5. Check database: `verificationStatus = REJECTED`, `rejectionReason = "..."`
6. Provider sees rejection banner with reason
7. Provider clicks "Resubmit Documents"
8. Uploads new documents
9. Status changes to `RESUBMITTED`
10. Admin reviews again

### Test Scenario 4: Client Search

1. Login as client
2. Search for services (e.g., "Plumbing")
3. Results show ONLY providers with `verificationStatus = APPROVED`
4. Pending/Rejected providers not visible

---

## 📊 Admin Analytics

Add to admin dashboard:

```typescript
interface VerificationStats {
  pendingCount: number;        // Awaiting review
  approvedToday: number;       // Approved in last 24h
  rejectedToday: number;       // Rejected in last 24h
  averageReviewTime: number;   // In hours
  totalProviders: number;
  activeProviders: number;     // APPROVED
}
```

**Display**:
- Pending Verifications: **5** (requires action)
- Approved Today: **3**
- Average Review Time: **18 hours**

---

## 🚀 Deployment Checklist

- [ ] Update Prisma schema with new fields
- [ ] Run `npx prisma db push`
- [ ] Run `npx prisma generate`
- [ ] Update backend admin endpoints
- [ ] Add document upload to provider signup
- [ ] Create admin verification dashboard
- [ ] Add status banners to provider dashboard
- [ ] Update services filter (only APPROVED)
- [ ] Test complete workflow
- [ ] Set up email notifications (optional)
- [ ] Add file upload to cloud storage

---

## 📝 API Endpoints Summary

```
POST   /api/auth/provider-signup     # With document uploads
GET    /api/admin/providers/pending  # List pending providers
GET    /api/admin/providers/:id      # Provider details
PATCH  /api/admin/providers/:id/verify  # Approve/reject
GET    /api/services                 # Filtered by APPROVED only
POST   /api/services                 # Guard: must be APPROVED
```

---

## 🎯 Success Criteria

✅ Providers can signup with documents
✅ Admin can view pending providers
✅ Admin can approve/reject with reason
✅ Only APPROVED providers visible to clients
✅ Rejected providers can resubmit
✅ Status banners show current state
✅ Email notifications sent (optional)
✅ Analytics track verification metrics

---

**This workflow ensures quality control and builds trust in the platform!** 🛡️
