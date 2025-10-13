# Client & Provider Headers with Notification Bell

## Components Created

### 1. **ProviderHeader** (`components/ProviderHeader.tsx`) ✅

- Green theme for providers
- Notification bell integrated
- Responsive navigation (desktop + mobile bottom nav)
- Links: Home, Bookings, Services, Payouts, Profile
- Mobile-friendly with bottom navigation bar

### 2. **ClientHeader** (`components/ClientHeader.tsx`) ✅

- Blue theme for clients
- Notification bell integrated
- Responsive navigation (desktop + mobile bottom nav)
- Links: Home, Browse Services, My Bookings, Addresses, Profile
- Mobile-friendly with bottom navigation bar

### 3. **NotificationBell** (`components/NotificationBell.tsx`) ✅

- Real-time notifications
- Unread badge counter
- Auto-refresh every 30 seconds
- Dropdown with rich notification content
- Google Maps integration
- Contact info display

---

## How to Use

### In Client Dashboard Pages:

**File:** `app/dashboard/client/page.tsx` (or any client page)

```tsx
import ClientHeader from "@/components/ClientHeader";

export default function ClientDashboard() {
  return (
    <>
      <ClientHeader />

      <div className="container mx-auto p-4">{/* Your page content */}</div>
    </>
  );
}
```

### In Provider Dashboard Pages:

**File:** `app/dashboard/provider/page.tsx` (or any provider page)

```tsx
import ProviderHeader from "@/components/ProviderHeader";

export default function ProviderDashboard() {
  return (
    <>
      <ProviderHeader />

      <div className="container mx-auto p-4">{/* Your page content */}</div>
    </>
  );
}
```

---

## Features

### Desktop Navigation:

- ✅ Sticky header with shadow on scroll
- ✅ Brand logo with gradient icon
- ✅ Horizontal navigation links
- ✅ Notification bell with unread badge
- ✅ Settings icon
- ✅ Logout button

### Mobile Navigation:

- ✅ Fixed bottom navigation bar
- ✅ Icon + label for each section
- ✅ Smooth animations (Framer Motion)
- ✅ Touch-friendly tap targets
- ✅ Hidden on desktop (shows on mobile only)

### Notification Bell:

- ✅ Shows unread count badge
- ✅ Dropdown panel with notifications
- ✅ Auto-refresh every 30 seconds
- ✅ Provider contact info (after acceptance)
- ✅ Google Maps tracking links
- ✅ Mark as read functionality
- ✅ Beautifully styled dropdown

---

## Styling Differences

### ProviderHeader (Green Theme):

```css
- Primary Color: green-600
- Gradient: from-green-600 to-teal-500
- Hover: hover:text-green-600
- Perfect for service providers
```

### ClientHeader (Blue Theme):

```css
- Primary Color: blue-600
- Gradient: from-blue-600 to-teal-500
- Hover: hover:text-blue-600
- Perfect for clients/customers
```

---

## Navigation Structure

### Provider Navigation:

```
Desktop:
- Home              → /dashboard/provider
- Bookings          → /dashboard/provider/bookings
- Services          → /dashboard/provider/services
- Payouts           → /dashboard/provider/payouts
- Profile           → /dashboard/provider/profile
- Settings          → /dashboard/provider/settings
- [Notification Bell]
- Logout

Mobile (Bottom Nav):
- Home
- Bookings
- Services
- Payouts
- Profile
```

### Client Navigation:

```
Desktop:
- Home              → /dashboard/client
- Browse Services   → /services
- My Bookings       → /dashboard/client/bookings
- Addresses         → /dashboard/client/addresses
- Profile           → /dashboard/client/profile
- Settings          → /dashboard/client/settings
- [Notification Bell]
- Logout

Mobile (Bottom Nav):
- Home
- Services
- Bookings
- Addresses
- Profile
```

---

## Responsive Behavior

### Desktop (md: 768px and up):

- Shows horizontal navigation in header
- Notification bell visible in top right
- Bottom navigation hidden
- Full navigation links visible

### Mobile (below 768px):

- Top header shows only logo
- Bottom navigation bar appears (fixed)
- 5 main sections accessible from bottom
- Notification bell available in dropdown menu

---

## Animation Details

### Header Scroll Effect:

```tsx
// Shadow increases on scroll
scrolled ? "shadow-lg" : "shadow-sm";
```

### Mobile Bottom Nav:

```tsx
// Slides up from bottom on mount
initial={{ y: 100 }}
animate={{ y: 0 }}
exit={{ y: 100 }}
```

### Logo/Brand:

```tsx
// Fades in and slides down
initial={{ opacity: 0, y: -10 }}
animate={{ opacity: 1, y: 0 }}
```

---

## Integration Checklist

### For Client Pages:

- [ ] Import ClientHeader component
- [ ] Add `<ClientHeader />` at top of page
- [ ] Ensure user is authenticated
- [ ] Test notification bell functionality
- [ ] Test mobile responsiveness
- [ ] Test all navigation links

### For Provider Pages:

- [ ] Import ProviderHeader component
- [ ] Add `<ProviderHeader />` at top of page
- [ ] Ensure user is authenticated
- [ ] Test notification bell functionality
- [ ] Test mobile responsiveness
- [ ] Test all navigation links

---

## Customization Options

### Change Colors:

```tsx
// In ClientHeader.tsx
className = "text-blue-600"; // Change to your brand color
className = "from-blue-600 to-teal-500"; // Gradient colors

// In ProviderHeader.tsx
className = "text-green-600"; // Change to your brand color
className = "from-green-600 to-teal-500"; // Gradient colors
```

### Add New Navigation Link:

```tsx
// Desktop
<a
  href="/dashboard/client/new-page"
  className="text-gray-700 hover:text-blue-600 font-medium text-sm"
>
  New Page
</a>

// Mobile (add icon)
<a
  href="/dashboard/client/new-page"
  className="flex flex-col items-center text-gray-600 hover:text-blue-600"
>
  <FiNewIcon size={20} />
  <span className="text-xs">New Page</span>
</a>
```

### Change Notification Refresh Rate:

```tsx
// In NotificationBell.tsx
const interval = setInterval(fetchUnreadCount, 30000);
// Change 30000 to desired milliseconds
```

---

## Troubleshooting

### Notification Bell Not Showing:

1. Check if NotificationBell component is imported
2. Verify backend is running on port 4001
3. Check browser console for errors
4. Ensure JWT token is valid (try re-login)

### Navigation Links Not Working:

1. Verify routes exist in your Next.js app structure
2. Check for typos in href paths
3. Ensure pages are created in correct folders

### Mobile Nav Not Appearing:

1. Check screen size (should be < 768px)
2. Verify `md:hidden` class is present
3. Check z-index conflicts with other elements

### Styling Issues:

1. Ensure Tailwind CSS is properly configured
2. Check for CSS conflicts with global styles
3. Verify Framer Motion is installed: `npm install framer-motion`

---

## Dependencies

Make sure these are installed:

```json
{
  "dependencies": {
    "framer-motion": "^10.x.x",
    "react-icons": "^4.x.x",
    "next": "^14.x.x",
    "react": "^18.x.x"
  }
}
```

Install if missing:

```bash
npm install framer-motion react-icons
```

---

## Example Pages

### Client Dashboard Example:

```tsx
// app/dashboard/client/page.tsx
import ClientHeader from "@/components/ClientHeader";

export default function ClientDashboard() {
  return (
    <>
      <ClientHeader />

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats cards, bookings, etc. */}
          </div>
        </div>
      </div>
    </>
  );
}
```

### Provider Dashboard Example:

```tsx
// app/dashboard/provider/page.tsx
import ProviderHeader from "@/components/ProviderHeader";

export default function ProviderDashboard() {
  return (
    <>
      <ProviderHeader />

      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-6">Provider Dashboard</h1>

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats cards, bookings, etc. */}
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## Summary

✅ **ProviderHeader** - Green theme with provider navigation  
✅ **ClientHeader** - Blue theme with client navigation  
✅ **NotificationBell** - Real-time notifications with tracking  
✅ **Responsive Design** - Desktop + Mobile bottom nav  
✅ **Smooth Animations** - Framer Motion effects  
✅ **Easy Integration** - Just import and add to pages

**All headers are ready to use! Simply import them into your dashboard pages.** 🎉
