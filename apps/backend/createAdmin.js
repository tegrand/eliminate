import prisma from './src/config/prisma.js';
import bcrypt from 'bcrypt';

async function main() {
  const email = "javid.prsnl.act@gmail.com";
  const password = "Pass123@";
  
  let superAdminRole = await prisma.role.findUnique({ where: { name: "SUPER_ADMIN" } });
  if (!superAdminRole) {
    superAdminRole = await prisma.role.create({
      data: {
        name: "SUPER_ADMIN",
        displayName: "Super Admin",
        description: "System administrator",
      }
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  
  await prisma.user.upsert({
    where: { email },
    update: {
      email,
      passwordHash,
      status: "ACTIVE",
      profileType: "SUPER_ADMIN",
      firstName: "Javid",
      lastName: "Admin",
      emailVerified: true,
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
  console.log("Super Admin created successfully:", email);
}

main().catch(console.error).finally(() => prisma.$disconnect());
