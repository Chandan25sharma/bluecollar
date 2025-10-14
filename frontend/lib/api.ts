import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Remove invalid token and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Authentication API methods
export const authAPI = {
  clientSignup: (userData: { email: string; password: string; phone: string; name?: string }) =>
    api.post('/auth/client-signup', userData),
  
  providerSignup: (userData: { email: string; password: string; phone: string; name?: string; skills?: string[]; rate?: number }) =>
    api.post('/auth/provider-signup', userData),
  
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login', credentials),
};

// Profile API methods
export const profileAPI = {
  getClientProfile: () =>
    api.get('/profiles/client/me'),
  
  getProviderProfile: () =>
    api.get('/profiles/provider/me'),
  
  updateClientProfile: (data: any) =>
    api.put('/profiles/client', data),
  
  updateProviderProfile: (data: any) =>
    api.put('/profiles/provider', data),
  
  getAllProviders: (params?: { skills?: string; minRate?: number; maxRate?: number }) =>
    api.get('/profiles/providers', { params }),
};

// Services API methods
export const servicesAPI = {
  getServices: () =>
    api.get('/services'),
  
  getNearbyServices: (latitude: number, longitude: number, category?: string, maxDistance?: number) =>
    api.get('/services/nearby', {
      params: { latitude, longitude, category, maxDistance }
    }),
  
  getService: (id: string) =>
    api.get(`/services/${id}`),
  
  getMyServices: () =>
    api.get('/services/provider/my-services'),
  
  createService: (serviceData: any) =>
    api.post('/services', serviceData),
  
  updateService: (id: string, data: any) =>
    api.put(`/services/${id}`, data),
  
  deleteService: (id: string) =>
    api.delete(`/services/${id}`),
  
  toggleServiceStatus: (id: string) =>
    api.put(`/services/${id}/toggle-status`),
};

// Bookings API methods
export const bookingsAPI = {
  createBooking: (bookingData: any) =>
    api.post('/bookings', bookingData),
  
  getBooking: (id: string) =>
    api.get(`/bookings/${id}`),
  
  getClientBookings: () =>
    api.get('/bookings/client/my-bookings'),
  
  getProviderBookings: () =>
    api.get('/bookings/provider/my-bookings'),
  
  updateBookingStatus: (id: string, status: string) =>
    api.put(`/bookings/${id}/status`, { status }),
  
  getPayouts: () =>
    api.get('/provider/payouts'),
};

// Payment API methods
export const paymentsAPI = {
  createOrder: (bookingId: string, amount: number, providerId: string) =>
    api.post('/payments/create-order', { bookingId, amount, providerId }),
  
  verifyPayment: (paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) =>
    api.post('/payments/verify', paymentData),
  
  getPaymentByBooking: (bookingId: string) =>
    api.get(`/payments/booking/${bookingId}`),
  
  // Admin functions
  getAllPayments: (page?: number, limit?: number, status?: string) =>
    api.get('/payments/admin/all', { params: { page, limit, status } }),
  
  refundPayment: (paymentId: string, reason?: string) =>
    api.post(`/payments/admin/refund/${paymentId}`, { reason }),
  
  getPaymentStats: () =>
    api.get('/payments/admin/stats'),
};

// Notifications API methods
export const notificationsAPI = {
  getNotifications: (unreadOnly = false) =>
    api.get('/notifications', { params: { unread: unreadOnly } }),
  
  getUnreadCount: () =>
    api.get('/notifications/unread-count'),
  
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/notifications/mark-all-read'),
};

// Addresses API methods
export const addressesAPI = {
  getAddresses: () =>
    api.get('/addresses'),
  
  createAddress: (addressData: any) =>
    api.post('/addresses', addressData),
  
  updateAddress: (id: string, data: any) =>
    api.put(`/addresses/${id}`, data),
  
  deleteAddress: (id: string) =>
    api.delete(`/addresses/${id}`),
  
  setDefaultAddress: (id: string) =>
    api.put(`/addresses/${id}/set-default`),
};

// Admin API methods
export const adminAPI = {
  getStats: (timeRange?: string) =>
    api.get('/admin/stats', { params: { timeRange } }),
  
  getRecentActivities: (limit?: number) =>
    api.get('/admin/recent-activities', { params: { limit } }),
  
  getAllUsers: (page?: number, limit?: number, role?: string) =>
    api.get('/admin/users', { params: { page, limit, role } }),
  
  getAllBookings: (page?: number, limit?: number, status?: string) =>
    api.get('/admin/bookings', { params: { page, limit, status } }),
  
  getAllServices: (page?: number, limit?: number, isActive?: boolean) =>
    api.get('/admin/services', { params: { page, limit, isActive } }),
  
  getAllProviders: (page?: number, limit?: number, verified?: boolean) =>
    api.get('/admin/providers', { params: { page, limit, verified } }),
  
  getPendingProviders: () =>
    api.get('/admin/providers/pending'),
  
  getProviderDetails: (id: string) =>
    api.get(`/admin/providers/${id}`),
  
  verifyProvider: (id: string, data: { adminId: string; approved: boolean; reason?: string }) =>
    api.patch(`/admin/providers/${id}/verify`, data),
};
