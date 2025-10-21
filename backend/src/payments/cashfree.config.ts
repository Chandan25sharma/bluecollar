export const CASHFREE_CONFIG = {
  // Test Environment
  TEST: {
    APP_ID: process.env.CASHFREE_TEST_APP_ID || 'TEST_APP_ID_PLACEHOLDER',
    SECRET_KEY: process.env.CASHFREE_TEST_SECRET_KEY || 'TEST_SECRET_KEY_PLACEHOLDER',
    BASE_URL: 'https://sandbox.cashfree.com/pg',
    ENVIRONMENT: 'TEST'
  },
  
  // Production Environment  
  PRODUCTION: {
    APP_ID: process.env.CASHFREE_PROD_APP_ID || '',
    SECRET_KEY: process.env.CASHFREE_PROD_SECRET_KEY || '',
    BASE_URL: 'https://api.cashfree.com/pg',
    ENVIRONMENT: 'PRODUCTION'
  },
  
  // Current environment (defaults to TEST)
  CURRENT: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST'
};

// Get current environment config
export const getCashfreeConfig = () => {
  return CASHFREE_CONFIG.CURRENT === 'PRODUCTION' 
    ? CASHFREE_CONFIG.PRODUCTION 
    : CASHFREE_CONFIG.TEST;
};

// Payment configuration
export const PAYMENT_CONFIG = {
  currency: 'INR',
  commissionRate: 0.1, // 10% commission
  providerRate: 0.9,   // 90% to provider
  returnUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  webhookUrl: process.env.BACKEND_URL || 'http://localhost:4001/api/payments/cashfree/webhook',
};

// Test payment scenarios for development
export const TEST_PAYMENT_SCENARIOS = {
  SUCCESS: {
    cardNumber: '4111111111111111',
    expiryMonth: '12',
    expiryYear: '25',
    cvv: '123',
    description: 'Test successful payment'
  },
  FAILURE: {
    cardNumber: '4000000000000002',
    expiryMonth: '12', 
    expiryYear: '25',
    cvv: '123',
    description: 'Test failed payment'
  }
};