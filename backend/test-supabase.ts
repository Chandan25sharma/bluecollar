import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing Supabase connection...');
    
    // Test database connection
    await prisma.$connect();
    console.log('✅ Successfully connected to Supabase!');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`📊 Found ${userCount} users in database`);
    
    console.log('🎉 Supabase setup is working correctly!');
    
  } catch (error) {
    console.error('❌ Supabase connection failed:');
    console.error(error);
    console.log('\n📝 Please check:');
    console.log('1. DATABASE_URL is correct in .env file');
    console.log('2. Supabase project is not paused');
    console.log('3. Database password is correct');
    console.log('4. Run "npx prisma db push" to sync schema');
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
