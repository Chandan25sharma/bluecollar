const Razorpay = require('razorpay');

// Initialize Razorpay only if credentials are available
export const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || !keySecret) {
    console.warn('⚠️ Razorpay credentials not found - payment service disabled');
    return null;
  }
  
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

// Payment configuration constants
export const PAYMENT_CONFIG = {
  currency: 'INR',
  commissionRate: 0.10, // 10% commission for platform
  providerRate: 0.90,   // 90% goes to provider
  
  // Test amounts for development
  minAmount: 1,          // Minimum ₹1
  maxAmount: 100000,     // Maximum ₹1,00,000
} as const;