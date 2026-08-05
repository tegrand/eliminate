import prisma from './src/config/prisma.js';

async function clear() {
  await prisma.jobApplication.deleteMany({});
  await prisma.hiringRequest.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.assignmentWorker.deleteMany({});
  await prisma.assignment.deleteMany({});
  await prisma.jobRequirementSkill.deleteMany({});
  await prisma.jobRequirementLanguage.deleteMany({});
  await prisma.jobRequirement.deleteMany({});
  
  await prisma.review.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.workerAttendance.deleteMany({});
  
  await prisma.user.deleteMany({
    where: {
      profileType: {
        not: 'SUPER_ADMIN'
      }
    }
  });
  console.log('Deleted all users except Super Admin and cleared transactional data');
}

clear().catch(console.error).finally(() => prisma.$disconnect());
