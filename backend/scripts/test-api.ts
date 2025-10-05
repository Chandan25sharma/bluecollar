import axios from 'axios';

const API_BASE = 'http://localhost:4001/api';

async function testAPIs() {
  console.log('🧪 Testing Backend APIs...\n');

  try {
    // Test 1: Login as client
    console.log('1. Testing client login...');
    const clientLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'client@test.com',
      password: 'password123'
    });
    console.log('✅ Client login successful');
    const clientToken = clientLogin.data.token;

    // Test 2: Login as provider
    console.log('2. Testing provider login...');
    const providerLogin = await axios.post(`${API_BASE}/auth/login`, {
      email: 'provider1@test.com',
      password: 'password123'
    });
    console.log('✅ Provider login successful');
    const providerToken = providerLogin.data.token;

    // Test 3: Get all services
    console.log('3. Testing get all services...');
    const services = await axios.get(`${API_BASE}/services`);
    console.log(`✅ Found ${services.data.length} services`);
    const serviceId = services.data[0]?.id;

    // Test 4: Get providers
    console.log('4. Testing get all providers...');
    const providers = await axios.get(`${API_BASE}/profiles/providers`);
    console.log(`✅ Found ${providers.data.length} providers`);

    // Test 5: Get client profile
    console.log('5. Testing get client profile...');
    const clientProfile = await axios.get(`${API_BASE}/profiles/client/me`, {
      headers: { Authorization: `Bearer ${clientToken}` }
    });
    console.log('✅ Client profile retrieved successfully');

    // Test 6: Get provider profile
    console.log('6. Testing get provider profile...');
    const providerProfile = await axios.get(`${API_BASE}/profiles/provider/me`, {
      headers: { Authorization: `Bearer ${providerToken}` }
    });
    console.log('✅ Provider profile retrieved successfully');

    // Test 7: Create booking (if service exists)
    if (serviceId && clientProfile.data?.id && providerProfile.data?.id) {
      console.log('7. Testing create booking...');
      const booking = await axios.post(`${API_BASE}/bookings`, {
        serviceId: serviceId,
        providerId: providerProfile.data.id,
        date: new Date().toISOString(),
        notes: 'Test booking from API test'
      }, {
        headers: { Authorization: `Bearer ${clientToken}` }
      });
      console.log('✅ Booking created successfully');
      console.log(`   Booking ID: ${booking.data.id}`);
    }

    console.log('\n🎉 All API tests passed successfully!');

  } catch (error: any) {
    console.error('❌ API test failed:');
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    if (error.code) {
      console.error('Error code:', error.code);
    }
  }
}

testAPIs();