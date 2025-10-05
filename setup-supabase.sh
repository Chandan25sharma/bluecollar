#!/bin/bash
# setup-supabase.sh - Quick setup script for Supabase

echo "🚀 BlueCollar Supabase Setup"
echo "=============================="

echo "1. Go to https://supabase.com/dashboard"
echo "2. Check if your project 'ynxmduzjcouwqyuykgal' is active"
echo "3. If paused, click 'Resume project'"
echo "4. Go to Settings > Database"
echo "5. Copy the connection string"
echo ""

echo "Current .env configuration:"
echo "DATABASE_URL=\"postgresql://postgres:Z6UkUwHQCmkrwLey@db.ynxmduzjcouwqyuykgal.supabase.co:5432/postgres\""
echo ""

echo "If the password changed, update backend/.env with the new connection string"
echo ""

echo "Then run:"
echo "npx prisma migrate dev --name init"
echo "npm run start:dev"