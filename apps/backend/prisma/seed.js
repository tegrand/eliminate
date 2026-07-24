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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });