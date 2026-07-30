import prisma from './src/config/prisma.js';

async function testUpdate() {
  try {
    const worker = await prisma.worker.findFirst();
    if (!worker) {
      console.log('No worker found');
      return;
    }

    const res = await prisma.worker.update({
      where: { id: worker.id },
      data: {
        workPreferences: ["Daily Work", "Contract Work"]
      }
    });
    console.log('Success:', res.workPreferences);
  } catch (e) {
    console.error('Prisma Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUpdate();
