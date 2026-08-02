import prisma from "./src/config/prisma.js";

async function main() {
  const job = await prisma.jobRequirement.findFirst({
    where: { title: 'Custom Hiring Request' },
    orderBy: { createdAt: 'desc' }
  });
  console.log('Found job:', job?.id);
  
  if (job) {
    try {
      await prisma.jobRequirement.update({
        where: { id: job.id },
        data: { deletedAt: new Date() }
      });
      console.log('Deleted successfully');
    } catch (e) {
      console.error('Delete error:', e);
    }
  }
}
main().catch(console.error).finally(() => process.exit(0));
