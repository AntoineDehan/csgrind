import { prisma } from "./lib/prisma";
import { BADGE_DEFS } from "../src/selectors/badge_catalog";

async function main() {
  for (const def of BADGE_DEFS) {
    await prisma.badge.upsert({
      where: { name: def.name },
      update: { description: def.description, icon: def.icon },
      create: { name: def.name, description: def.description, icon: def.icon },
    });
  }
  console.log(`Seeded ${BADGE_DEFS.length} badges`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
