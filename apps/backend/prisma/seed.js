import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  const roles = [
    {
      name: "SUPER_ADMIN",
      displayName: "Super Admin",
      description: "System administrator",
    },
    {
      name: "CLIENT",
      displayName: "Client",
      description: "Client account",
    },
    {
      name: "AGENCY",
      displayName: "Agency",
      description: "Agency account",
    },
    {
      name: "WORKER",
      displayName: "Worker",
      description: "Worker account",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles seeded successfully.");

  // Create Super Admin
  const superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  
  if (superAdminRole) {
    const email = "javid.prsnl.act@gmail.com";
    const password = "Pass123@";
    const bcrypt = await import("bcrypt");
    const passwordHash = await bcrypt.default.hash(password, 10);
    
    await prisma.user.upsert({
      where: { email },
      update: {
        passwordHash,
        status: "ACTIVE",
        roleId: superAdminRole.id,
      },
      create: {
        email,
        passwordHash,
        status: "ACTIVE",
        profileType: "SUPER_ADMIN",
        firstName: "Javid",
        lastName: "Admin",
        emailVerified: true,
        roleId: superAdminRole.id,
      }
    });
    console.log("✅ Super Admin created successfully:", email);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });