import { PrismaClient } from "./src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from 'pg';
import "dotenv/config";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const clientRole = await prisma.role.findUnique({ where: { name: 'CLIENT' } });
  if (!clientRole) { console.log("CLIENT role not found"); return; }
  
  const perms = ['category:create', 'category:read', 'category:update', 'category:delete', 'location:create', 'location:read', 'location:update', 'location:delete'];
  
  for (const perm of perms) {
    let p = await prisma.permission.findUnique({ where: { name: perm } });
    if (!p) {
      p = await prisma.permission.create({ 
        data: { 
          name: perm, 
          displayName: perm,
          description: perm, 
          module: perm.split(':')[0], 
          isActive: true 
        } 
      });
    }
    
    // Check if mapping exists
    const mapping = await prisma.rolePermission.findFirst({
      where: { roleId: clientRole.id, permissionId: p.id }
    });
    
    if (!mapping) {
      await prisma.rolePermission.create({
        data: { roleId: clientRole.id, permissionId: p.id }
      });
      console.log(`Granted ${perm} to CLIENT`);
    } else {
      console.log(`CLIENT already has ${perm}`);
    }
  }
}
main().catch(console.error).finally(() => { pool.end(); prisma.$disconnect(); });
