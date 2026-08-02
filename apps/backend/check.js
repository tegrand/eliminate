import prisma from "./src/config/prisma.js";

async function main() {
  console.log("Checking Assignments...");
  const assignments = await prisma.assignment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { assignedWorkers: true }
  });
  console.log(JSON.stringify(assignments, null, 2));

  console.log("\nChecking Job Applications...");
  const apps = await prisma.jobApplication.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(apps, null, 2));

  console.log("\nChecking Hiring Requests...");
  const reqs = await prisma.hiringRequest.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });
  console.log(JSON.stringify(reqs, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
