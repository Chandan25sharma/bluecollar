const Razorpay = require('razorpay');

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Payment configuration constants
export const PAYMENT_CONFIG = {
  currency: 'INR',
  commissionRate: 0.10, // 10% commission for platform
  providerRate: 0.90,   // 90% goes to provider
  
  // Test amounts for development
  minAmount: 1,          // Minimum ₹1
  maxAmount: 100000,     // Maximum ₹1,00,000
} as const;