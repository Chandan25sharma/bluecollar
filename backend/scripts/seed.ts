import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';

// Real locations in Nepal and India
const nepalLocations = [
  { city: 'Kathmandu', lat: 27.7172, lng: 85.3240, address: 'Thamel, Kathmandu, Nepal', state: 'Bagmati Province' },
  { city: 'Kathmandu', lat: 27.6918, lng: 85.3206, address: 'Durbar Marg, Kathmandu, Nepal', state: 'Bagmati Province' },
  { city: 'Kathmandu', lat: 27.7024, lng: 85.3077, address: 'New Baneshwor, Kathmandu, Nepal', state: 'Bagmati Province' },
  { city: 'Lalitpur', lat: 27.6669, lng: 85.3102, address: 'Patan Dhoka, Lalitpur, Nepal', state: 'Bagmati Province' },
  { city: 'Bhaktapur', lat: 27.6710, lng: 85.4298, address: 'Bhaktapur Durbar Square, Nepal', state: 'Bagmati Province' },
  { city: 'Pokhara', lat: 28.2096, lng: 83.9856, address: 'Lakeside, Pokhara, Nepal', state: 'Gandaki Province' },
  { city: 'Pokhara', lat: 28.2380, lng: 83.9956, address: 'Mahendrapul, Pokhara, Nepal', state: 'Gandaki Province' },
  { city: 'Chitwan', lat: 27.5291, lng: 84.3542, address: 'Bharatpur, Chitwan, Nepal', state: 'Bagmati Province' },
  { city: 'Butwal', lat: 27.7000, lng: 83.4486, address: 'Traffic Chowk, Butwal, Nepal', state: 'Lumbini Province' },
  { city: 'Biratnagar', lat: 26.4525, lng: 87.2718, address: 'Main Road, Biratnagar, Nepal', state: 'Province No. 1' },
];

const indiaLocations = [
  { city: 'New Delhi', lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi, India', state: 'Delhi' },
  { city: 'Delhi', lat: 28.7041, lng: 77.1025, address: 'Karol Bagh, Delhi, India', state: 'Delhi' },
  { city: 'Mumbai', lat: 19.0760, lng: 72.8777, address: 'Andheri West, Mumbai, India', state: 'Maharashtra' },
  { city: 'Mumbai', lat: 19.0176, lng: 72.8562, address: 'Bandra West, Mumbai, India', state: 'Maharashtra' },
  { city: 'Bangalore', lat: 12.9716, lng: 77.5946, address: 'Koramangala, Bangalore, India', state: 'Karnataka' },
  { city: 'Bangalore', lat: 12.9352, lng: 77.6245, address: 'Whitefield, Bangalore, India', state: 'Karnataka' },
  { city: 'Chennai', lat: 13.0827, lng: 80.2707, address: 'T. Nagar, Chennai, India', state: 'Tamil Nadu' },
  { city: 'Pune', lat: 18.5204, lng: 73.8567, address: 'Koregaon Park, Pune, India', state: 'Maharashtra' },
  { city: 'Hyderabad', lat: 17.3850, lng: 78.4867, address: 'Banjara Hills, Hyderabad, India', state: 'Telangana' },
  { city: 'Kolkata', lat: 22.5726, lng: 88.3639, address: 'Park Street, Kolkata, India', state: 'West Bengal' },
  { city: 'Ahmedabad', lat: 23.0225, lng: 72.5714, address: 'Satellite, Ahmedabad, India', state: 'Gujarat' },
  { city: 'Jaipur', lat: 26.9124, lng: 75.7873, address: 'Pink City, Jaipur, India', state: 'Rajasthan' },
];

// Service categories and details
const services = [
  { title: 'Plumbing Repair', description: 'Professional plumbing services for pipe repairs, leaks, and installations', category: 'Plumbing', duration: '2 hours', basePrice: 1500 },
  { title: 'Electrical Wiring', description: 'Expert electrical wiring and installation services', category: 'Electrical', duration: '3 hours', basePrice: 2000 },
  { title: 'House Cleaning', description: 'Deep cleaning services for your home', category: 'Cleaning', duration: '4 hours', basePrice: 1000 },
  { title: 'AC Repair', description: 'Air conditioning repair and maintenance', category: 'HVAC', duration: '2 hours', basePrice: 1800 },
  { title: 'Home Painting', description: 'Professional house painting services', category: 'Painting', duration: '8 hours', basePrice: 3000 },
  { title: 'Carpentry Work', description: 'Custom carpentry and furniture repair', category: 'Carpentry', duration: '6 hours', basePrice: 2500 },
  { title: 'Appliance Repair', description: 'Repair services for home appliances', category: 'Appliance', duration: '2 hours', basePrice: 1200 },
  { title: 'Garden Maintenance', description: 'Landscaping and garden care services', category: 'Gardening', duration: '4 hours', basePrice: 800 },
  { title: 'Pest Control', description: 'Professional pest control and fumigation', category: 'Pest Control', duration: '3 hours', basePrice: 1500 },
  { title: 'Lock Installation', description: 'Locksmith services and security installation', category: 'Security', duration: '1 hour', basePrice: 800 },
];

// Provider names and skills
const providerData = [
  { name: 'Ram Bahadur Shrestha', skills: ['Plumbing', 'Pipe Repair', 'Drain Cleaning'], category: 'Plumbing' },
  { name: 'Sita Kumari Maharjan', skills: ['Electrical Work', 'Wiring', 'Light Installation'], category: 'Electrical' },
  { name: 'Prakash Kumar Singh', skills: ['House Cleaning', 'Deep Cleaning', 'Office Cleaning'], category: 'Cleaning' },
  { name: 'Maya Devi Gurung', skills: ['AC Repair', 'HVAC Installation', 'Cooling Systems'], category: 'HVAC' },
  { name: 'Rajesh Kumar Thapa', skills: ['House Painting', 'Wall Painting', 'Interior Design'], category: 'Painting' },
  { name: 'Anita Sharma Poudel', skills: ['Carpentry', 'Furniture Repair', 'Wood Work'], category: 'Carpentry' },
  { name: 'Bikash Magar', skills: ['Appliance Repair', 'TV Repair', 'Washing Machine Fix'], category: 'Appliance' },
  { name: 'Sunita Rai', skills: ['Garden Maintenance', 'Landscaping', 'Plant Care'], category: 'Gardening' },
  { name: 'Dipak Tamang', skills: ['Pest Control', 'Fumigation', 'Insect Control'], category: 'Pest Control' },
  { name: 'Kamala Devi Neupane', skills: ['Locksmith', 'Security Installation', 'Key Making'], category: 'Security' },
  { name: 'Arjun Bahadur Chhetri', skills: ['Plumbing', 'Water System', 'Bathroom Fitting'], category: 'Plumbing' },
  { name: 'Radha Krishna Joshi', skills: ['Electrical Work', 'Solar Installation', 'Inverter Setup'], category: 'Electrical' },
  { name: 'Gita Kumari Basnet', skills: ['House Cleaning', 'Carpet Cleaning', 'Window Cleaning'], category: 'Cleaning' },
  { name: 'Nabin Kumar Khadka', skills: ['AC Repair', 'Refrigerator Repair', 'Fan Installation'], category: 'HVAC' },
  { name: 'Laxmi Devi Sapkota', skills: ['House Painting', 'Exterior Painting', 'Decorative Paint'], category: 'Painting' },
];

// Client names
const clientNames = [
  'Hari Prasad Koirala', 'Shanti Maya Gurung', 'Krishna Bahadur Magar', 'Devi Kumari Shrestha', 
  'Lok Bahadur Thapa', 'Geeta Sharma', 'Raju Maharjan', 'Bimala Rai', 'Surya Bahadur Tamang', 
  'Kamala Neupane', 'Deepak Chhetri', 'Sushila Joshi', 'Ramesh Basnet', 'Sabita Khadka', 
  'Mohan Sapkota', 'Indira Devi Acharya', 'Gopal Bhattarai', 'Bishnu Maya Karki'
];

async function seed() {
  const prisma = new PrismaService();
  await prisma.$connect();

  try {
    console.log('🌱 Starting comprehensive seed with real Nepal/India data...');

    // Clear existing data (optional - for development)
    await prisma.review.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.service.deleteMany();
    await prisma.clientProfile.deleteMany();
    await prisma.providerProfile.deleteMany();
    await prisma.adminProfile.deleteMany();
    await prisma.user.deleteMany();
    console.log('🧹 Cleared existing data...');

    // Create test users with profiles
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Create Admin User
    console.log('👑 Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@bluecollar.com',
        password: hashedPassword,
        phone: '+9779801234567',
        role: Role.ADMIN,
        verified: true,
      },
    });

    await prisma.adminProfile.create({
      data: {
        userId: adminUser.id,
        role: 'SUPER',
      },
    });

    // Create Client Users
    console.log('👥 Creating client users...');
    const clients = [];
    const allLocations = [...nepalLocations, ...indiaLocations];
    
    for (let i = 0; i < clientNames.length; i++) {
      const location = allLocations[i % allLocations.length];
      const clientUser = await prisma.user.create({
        data: {
          email: `client${i + 1}@bluecollar.com`,
          password: hashedPassword,
          phone: `+977${9800000000 + i}`,
          role: Role.CLIENT,
          verified: true,
        },
      });

      const clientProfile = await prisma.clientProfile.create({
        data: {
          userId: clientUser.id,
          name: clientNames[i],
          age: 25 + (i % 40),
          address: location.address,
          latitude: location.lat,
          longitude: location.lng,
          city: location.city,
          state: location.state,
        },
      });
      
      clients.push({ user: clientUser, profile: clientProfile });
    }

    // Create Provider Users
    console.log('🔧 Creating provider users...');
    const providers = [];
    
    for (let i = 0; i < providerData.length; i++) {
      const location = allLocations[i % allLocations.length];
      const provider = providerData[i];
      
      const providerUser = await prisma.user.create({
        data: {
          email: `provider${i + 1}@bluecollar.com`,
          password: hashedPassword,
          phone: `+977${9810000000 + i}`,
          role: Role.PROVIDER,
          verified: true,
        },
      });

      const providerProfile = await prisma.providerProfile.create({
        data: {
          userId: providerUser.id,
          name: provider.name,
          skills: provider.skills,
          rate: 1000 + (i * 200), // Rates from 1000 to 3800 NPR
          verified: i < 12, // First 12 providers are verified
          verificationStatus: i < 12 ? 'APPROVED' : 'PENDING',
          bankName: 'Nepal Bank Limited',
          bankAcc: `NBL${100000000 + i}`,
          govIdUrl: `https://docs.bluecollar.com/gov_id_${i + 1}.pdf`,
          businessLicenseUrl: `https://docs.bluecollar.com/license_${i + 1}.pdf`,
          insuranceDocUrl: i < 10 ? `https://docs.bluecollar.com/insurance_${i + 1}.pdf` : null,
          certificationUrls: [`https://docs.bluecollar.com/cert_${i + 1}.pdf`],
          address: location.address,
          latitude: location.lat,
          longitude: location.lng,
          city: location.city,
          state: location.state,
          verifiedAt: i < 12 ? new Date() : null,
        },
      });
      
      providers.push({ user: providerUser, profile: providerProfile, category: provider.category });
    }

    // Create Services for each provider
    console.log('🛠️ Creating services...');
    const createdServices = [];
    
    for (const provider of providers) {
      if (provider.profile.verified) { // Only create services for verified providers
        // Find matching service for this provider's category
        const serviceTemplate = services.find(s => s.category === provider.category);
        if (serviceTemplate) {
          const service = await prisma.service.create({
            data: {
              title: serviceTemplate.title,
              description: serviceTemplate.description,
              category: serviceTemplate.category,
              price: serviceTemplate.basePrice,
              duration: serviceTemplate.duration,
              providerId: provider.profile.id,
              isActive: true,
            },
          });
          createdServices.push(service);
        }
      }
    }

    // Create some bookings with client location data
    console.log('📋 Creating sample bookings...');
    const bookings = [];
    
    for (let i = 0; i < Math.min(5, clients.length, createdServices.length); i++) {
      const client = clients[i];
      const service = createdServices[i % createdServices.length];
      const provider = providers.find(p => p.profile.id === service.providerId);
      
      if (client && service && provider) {
        // Calculate distance between client and provider
        const distance = calculateDistance(
          client.profile.latitude!,
          client.profile.longitude!,
          provider.profile.latitude!,
          provider.profile.longitude!
        );

        const booking = await prisma.booking.create({
          data: {
            clientId: client.profile.id,
            providerId: provider.profile.id,
            serviceId: service.id,
            date: new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000), // Future dates
            status: i === 0 ? 'PENDING' : i === 1 ? 'ACCEPTED' : 'COMPLETED',
            totalAmount: service.price,
            notes: `Service requested for ${client.profile.name}`,
            clientAddress: client.profile.address,
            clientLatitude: client.profile.latitude,
            clientLongitude: client.profile.longitude,
          },
        });
        bookings.push(booking);
      }
    }

    console.log('✅ Comprehensive seed completed successfully!');
    console.log('\n📊 Created:');
    console.log(`- 1 Admin user`);
    console.log(`- ${clients.length} Clients with real Nepal/India locations`);
    console.log(`- ${providers.length} Providers (${providers.filter(p => p.profile.verified).length} verified, ${providers.filter(p => !p.profile.verified).length} pending)`);
    console.log(`- ${createdServices.length} Services across multiple categories`);
    console.log(`- ${bookings.length} Sample bookings with location data`);
    
    console.log('\n🌍 Location Coverage:');
    console.log('Nepal: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Chitwan, Butwal, Biratnagar');
    console.log('India: Delhi, Mumbai, Bangalore, Chennai, Pune, Hyderabad, Kolkata, Ahmedabad, Jaipur');
    
    console.log('\n🔑 Test credentials (all use password: password123):');
    console.log('Admin: admin@bluecollar.com');
    console.log('Clients: client1@bluecollar.com to client' + clients.length + '@bluecollar.com');
    console.log('Providers: provider1@bluecollar.com to provider' + providers.length + '@bluecollar.com');

    // Helper function for distance calculation
    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
      const R = 6371; // Radius of Earth in kilometers
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    }


  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();