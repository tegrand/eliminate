import prisma from "./src/config/prisma.js";

const SKILLS = [
  { name: "Mason", slug: "mason", description: "General masonry works, bricklaying, and stonework." },
  { name: "Helper", slug: "helper", description: "General site helper, manual labor." },
  { name: "Carpenter", slug: "carpenter", description: "Woodworking, structural and finishing carpentry." },
  { name: "Painter", slug: "painter", description: "Painting, surface preparation, and finishing." },
  { name: "Electrician", slug: "electrician", description: "Electrical wiring, installation, and maintenance." },
  { name: "Plumber", slug: "plumber", description: "Piping, plumbing fixtures installation, and repair." },
  { name: "Driver", slug: "driver", description: "Driving commercial vehicles or heavy equipment." },
  { name: "Welder", slug: "welder", description: "Welding and metal fabrication." },
  { name: "Tile Worker", slug: "tile-worker", description: "Tile laying, flooring, and finishing." },
  { name: "Steel Fixer", slug: "steel-fixer", description: "Reinforcement steel fixing for concrete." },
  { name: "Scaffolder", slug: "scaffolder", description: "Erecting and dismantling scaffolding." }
];

async function main() {
  console.log("Seeding skills...");

  for (const skill of SKILLS) {
    const exists = await prisma.skill.findUnique({
      where: { slug: skill.slug }
    });

    if (!exists) {
      await prisma.skill.create({
        data: skill
      });
      console.log(`Created skill: ${skill.name}`);
    } else {
      console.log(`Skill already exists: ${skill.name}`);
    }
  }

  console.log("Skills seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
