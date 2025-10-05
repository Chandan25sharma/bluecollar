import { authAPI } from './api';

export interface User {
  id: string;
  email: string;
  phone: string;
  role: 'CLIENT' | 'PROVIDER' | 'ADMIN';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Local storage keys
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user';

export const authUtils = {
  // Store authentication data
  setAuth: (authData: AuthResponse) => {
    localStorage.setItem(TOKEN_KEY, authData.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user));
  },

  // Get stored token
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Get stored user
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },

  // Check if user has specific role
  hasRole: (role: string): boolean => {
    const user = authUtils.getUser();
    return user?.role === role;
  },

  // Clear authentication data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  // Login function
  login: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await authAPI.login({ email, password });
      const authData: AuthResponse = response.data;
      
      authUtils.setAuth(authData);
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // Signup functions
  clientSignup: async (userData: {
    email: string;
    password: string;
    phone: string;
    name?: string;
  }): Promise<AuthResponse> => {
    try {
      const response = await authAPI.clientSignup(userData);
      const authData: AuthResponse = response.data;
      
      authUtils.setAuth(authData);
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  providerSignup: async (userData: {
    email: string;
    password: string;
    phone: string;
    name?: string;
    skills?: string[];
    rate?: number;
  }): Promise<AuthResponse> => {
    try {
      const response = await authAPI.providerSignup(userData);
      const authData: AuthResponse = response.data;
      
      authUtils.setAuth(authData);
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  },

  // Logout function
  logout: () => {
    authUtils.clearAuth();
    window.location.href = '/login';
  },
};
