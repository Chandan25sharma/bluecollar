export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    CLIENT_SIGNUP: '/api/auth/client-signup',
    PROVIDER_SIGNUP: '/api/auth/provider-signup',
  },
  SERVICES: '/api/services',
  BOOKINGS: '/api/bookings',
  ADMIN: {
    USERS: '/api/admin/users',
    PROVIDERS: '/api/admin/providers',
    SETTINGS: '/api/admin/settings',
  },
} as const;

export const USER_ROLES = {
  CLIENT: 'client',
  PROVIDER: 'provider',
  ADMIN: 'admin',
} as const;

export const SERVICE_CATEGORIES = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Moving',
  'Gardening',
  'Handyman',
] as const;
