import prisma from "../src/config/prisma.js";

async function main() {
  console.log("Starting migration of old payments...");

  // Find all assignments that are COMPLETED
  const assignments = await prisma.assignment.findMany({
    where: { status: "COMPLETED" },
    include: {
      assignedWorkers: true,
      workerPayments: true, // Assuming this relation exists on Assignment (it does, we added it earlier)
    }
  });

  let createdCount = 0;

  for (const assignment of assignments) {
    // Check if payments already exist for this assignment
    if (assignment.workerPayments && assignment.workerPayments.length > 0) {
      console.log(`Skipping assignment ${assignment.assignmentCode}: Payments already exist.`);
      continue;
    }

    const workerCount = assignment.assignedWorkers.length;
    if (workerCount > 0) {
      const amountPerWorker = parseFloat(assignment.agreedRate || 0) / workerCount;
      const workerPayments = assignment.assignedWorkers.map(aw => ({
        workerId: aw.workerId,
        amount: amountPerWorker,
        periodStart: assignment.startDate || new Date(),
        periodEnd: assignment.endDate || new Date(),
        status: "PENDING",
        assignmentId: assignment.id,
        notes: `Payout for assignment ${assignment.assignmentCode} (Migrated)`
      }));

      await prisma.workerPayment.createMany({
        data: workerPayments
      });
      
      createdCount += workerPayments.length;
      console.log(`Created ${workerPayments.length} pending payouts for assignment ${assignment.assignmentCode}`);
    } else {
      console.log(`Skipping assignment ${assignment.assignmentCode}: No workers assigned.`);
    }
  }

  console.log(`Migration completed successfully! Created ${createdCount} pending payouts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
