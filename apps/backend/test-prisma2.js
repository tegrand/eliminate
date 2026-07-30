import prisma from './src/config/prisma.js';

async function testFullUpdate() {
  try {
    const worker = await prisma.worker.findFirst();
    
    const payload = {
      firstName: "javid",
      lastName: "kk",
      gender: "Male",
      workPreferences: [
        "Daily Work",
        "Contract Work",
        "Full-Time"
      ],
      preferredDistrict: "Malappuram",
      preferredState: "Kerala",
      maxTravelDistance: 5,
      willingToRelocate: true,
    };

    const res = await prisma.worker.update({
      where: { id: worker.id },
      data: payload
    });
    console.log('Success!', res.firstName);
  } catch (e) {
    console.error('Prisma Error:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

testFullUpdate();
