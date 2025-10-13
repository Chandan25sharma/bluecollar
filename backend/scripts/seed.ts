import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../src/prisma/prisma.service';

async function seed() {
  const prisma = new PrismaService();
  await prisma.$connect();

  try {
    console.log('🌱 Starting seed...');

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
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@bluecollar.com',
        password: hashedPassword,
        phone: '+1234567899',
        role: Role.ADMIN,
        verified: true,
      },
    });

    const adminProfile = await prisma.adminProfile.create({
      data: {
        userId: adminUser.id,
        role: 'SUPER', // SUPER, FINANCE, KYC, or SUPPORT
      },
    });

    // Create Client User
    const clientUser = await prisma.user.create({
      data: {
        email: 'client@test.com',
        password: hashedPassword,
        phone: '+1234567890',
        role: Role.CLIENT,
        verified: true,
      },
    });

    const clientProfile = await prisma.clientProfile.create({
      data: {
        userId: clientUser.id,
        name: 'John Client',
        age: 30,
        address: '123 Main St, New York, NY 10001',
        latitude: 40.7589,
        longitude: -73.9851,
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
      },
    });

    // Create Provider Users
    const provider1User = await prisma.user.create({
      data: {
        email: 'provider1@test.com',
        password: hashedPassword,
        phone: '+1234567891',
        role: Role.PROVIDER,
        verified: true,
      },
    });

    const provider1Profile = await prisma.providerProfile.create({
      data: {
        userId: provider1User.id,
        name: 'Mike Plumber',
        skills: ['Plumbing', 'Pipe Repair', 'Drain Cleaning'],
        rate: 50.0,
        verified: true,
        verificationStatus: 'APPROVED',
        bankName: 'Test Bank',
        bankAcc: '123456789',
        govIdUrl: 'https://example.com/docs/mike_gov_id.pdf',
        businessLicenseUrl: 'https://example.com/docs/mike_license.pdf',
        insuranceDocUrl: 'https://example.com/docs/mike_insurance.pdf',
        certificationUrls: ['https://example.com/docs/mike_cert1.pdf'],
        address: '456 Broadway, New York, NY 10013',
        latitude: 40.7205,
        longitude: -74.0009,
        city: 'New York',
        state: 'NY',
        zipCode: '10013',
        verifiedAt: new Date(),
      },
    });

    const provider2User = await prisma.user.create({
      data: {
        email: 'provider2@test.com',
        password: hashedPassword,
        phone: '+1234567892',
        role: Role.PROVIDER,
        verified: true,
      },
    });

    const provider2Profile = await prisma.providerProfile.create({
      data: {
        userId: provider2User.id,
        name: 'Sarah Electrician',
        skills: ['Electrical Work', 'Wiring', 'Light Installation'],
        rate: 60.0,
        verified: true,
        verificationStatus: 'APPROVED',
        bankName: 'Test Bank',
        bankAcc: '987654321',
        govIdUrl: 'https://example.com/docs/sarah_gov_id.pdf',
        businessLicenseUrl: 'https://example.com/docs/sarah_license.pdf',
        insuranceDocUrl: 'https://example.com/docs/sarah_insurance.pdf',
        certificationUrls: ['https://example.com/docs/sarah_cert1.pdf', 'https://example.com/docs/sarah_cert2.pdf'],
        address: '789 5th Avenue, New York, NY 10022',
        latitude: 40.7614,
        longitude: -73.9776,
        city: 'New York',
        state: 'NY',
        zipCode: '10022',
        verifiedAt: new Date(),
      },
    });

    // Create Provider 3 (PENDING verification)
    const provider3User = await prisma.user.create({
      data: {
        email: 'provider3@test.com',
        password: hashedPassword,
        phone: '+1234567893',
        role: Role.PROVIDER,
        verified: false,
      },
    });

    const provider3Profile = await prisma.providerProfile.create({
      data: {
        userId: provider3User.id,
        name: 'Tom Carpenter',
        skills: ['Carpentry', 'Furniture Repair', 'Custom Woodwork'],
        rate: 55.0,
        verified: false,
        verificationStatus: 'PENDING',
        bankName: 'Test Bank',
        bankAcc: '555666777',
        govIdUrl: 'https://example.com/docs/tom_gov_id.pdf',
        businessLicenseUrl: 'https://example.com/docs/tom_license.pdf',
        insuranceDocUrl: null,
        certificationUrls: [],
        address: '321 Carpenter Lane, Brooklyn, NY 11201',
        latitude: 40.6892,
        longitude: -73.9942,
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201',
        verifiedAt: null,
      },
    });

    // Create Services
    const plumbingService = await prisma.service.create({
      data: {
        title: 'Emergency Plumbing Service',
        description: 'Fast and reliable plumbing repairs for your home',
        category: 'Plumbing',
        price: 50.0,
        duration: '2 hours',
        providerId: provider1Profile.id,
        isActive: true,
      },
    });

    const electricalService = await prisma.service.create({
      data: {
        title: 'Home Electrical Installation',
        description: 'Professional electrical work and installations',
        category: 'Electrical',
        price: 60.0,
        duration: '3 hours',
        providerId: provider2Profile.id,
        isActive: true,
      },
    });

    const cleaningService = await prisma.service.create({
      data: {
        title: 'House Cleaning Service',
        description: 'Complete house cleaning and maintenance',
        category: 'Cleaning',
        price: 40.0,
        duration: '4 hours',
        providerId: provider1Profile.id,
        isActive: true,
      },
    });

    const carpentryService = await prisma.service.create({
      data: {
        title: 'Custom Furniture Repair',
        description: 'Professional furniture repair and restoration',
        category: 'Carpentry',
        price: 55.0,
        duration: '2-3 hours',
        providerId: provider3Profile.id,
        isActive: false, // Not active because provider is pending verification
      },
    });

    console.log('✅ Seed completed successfully!');
    console.log('Created:');
    console.log(`- Admin: ${adminUser.email} (Role: ${adminProfile.role})`);
    console.log(`- Client: ${clientUser.email} (Profile: ${clientProfile.name})`);
    console.log(`- Provider 1: ${provider1User.email} (Profile: ${provider1Profile.name}) - APPROVED`);
    console.log(`- Provider 2: ${provider2User.email} (Profile: ${provider2Profile.name}) - APPROVED`);
    console.log(`- Provider 3: ${provider3User.email} (Profile: ${provider3Profile.name}) - PENDING`);
    console.log(`- Services: ${plumbingService.title}, ${electricalService.title}, ${cleaningService.title}, ${carpentryService.title}`);
    console.log('\n🔑 Test credentials:');
    console.log('Admin    : admin@bluecollar.com / password123');
    console.log('Client   : client@test.com / password123');
    console.log('Provider1: provider1@test.com / password123 (APPROVED)');
    console.log('Provider2: provider2@test.com / password123 (APPROVED)');
    console.log('Provider3: provider3@test.com / password123 (PENDING)');


  } catch (error) {
    console.error('❌ Seed failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();