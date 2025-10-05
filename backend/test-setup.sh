# Quick Test Script
# Run this to test if the basic setup works

echo "Testing BlueCollar Backend..."
echo "=============================="

# 1. Generate Prisma client
echo "1. Generating Prisma client..."
npx prisma generate

# 2. Check database
echo "2. Checking database..."
npx prisma migrate status

# 3. Try to start the app
echo "3. Starting the app..."
npm run start:dev