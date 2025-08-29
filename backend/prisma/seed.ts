import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bluecollar.local" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@bluecollar.local",
      password: adminPassword,
      role: "ADMIN",
      verified: true,
      phone: "+1234567890",
    },
  });

  // Create sample provider
  const providerPassword = await bcrypt.hash("provider123", 10);
  const provider = await prisma.user.upsert({
    where: { email: "provider@bluecollar.local" },
    update: {},
    create: {
      name: "John Electrician",
      email: "provider@bluecollar.local",
      password: providerPassword,
      role: "PROVIDER",
      verified: true,
      phone: "+1234567891",
    },
  });

  // Create sample client
  const clientPassword = await bcrypt.hash("client123", 10);
  const client = await prisma.user.upsert({
    where: { email: "client@bluecollar.local" },
    update: {},
    create: {
      name: "Jane Client",
      email: "client@bluecollar.local",
      password: clientPassword,
      role: "CLIENT",
      verified: true,
      phone: "+1234567892",
    },
  });

  // Create sample services
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: "Electrical Wiring Installation",
      description: "Professional electrical wiring for residential and commercial properties",
      price: 150.00,
      category: "ELECTRICAL",
      location: "New York, NY",
      providerId: provider.id,
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: "Plumbing Repair Services",
      description: "Expert plumbing repairs and maintenance",
      price: 120.00,
      category: "PLUMBING",
      location: "New York, NY",
      providerId: provider.id,
    },
  });

  console.log("Seed completed successfully!");
  console.log("Created users:");
  console.log("- Admin: admin@bluecollar.local / admin123");
  console.log("- Provider: provider@bluecollar.local / provider123");
  console.log("- Client: client@bluecollar.local / client123");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
