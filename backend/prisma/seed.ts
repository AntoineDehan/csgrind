import { prisma } from "./lib/prisma";
import { BADGE_DEFS } from "../src/selectors/badge_catalog";
import { TIP_SEEDS } from "./data/tips";
import { TASK_SEEDS } from "./data/tasks";

async function main() {
  for (const def of BADGE_DEFS) {
    await prisma.badge.upsert({
      where: { name: def.name },
      update: { description: def.description, icon: def.icon },
      create: { name: def.name, description: def.description, icon: def.icon },
    });
  }
  console.log(`Seeded ${BADGE_DEFS.length} badges`);

  for (const tip of TIP_SEEDS) {
    await prisma.tip.upsert({
      where: { id: tip.id },
      update: {
        category: tip.category,
        priority: tip.priority,
        content: tip.content,
      },
      create: tip,
    });
  }
  console.log(`Seeded ${TIP_SEEDS.length} tips`);

  for (const task of TASK_SEEDS) {
    await prisma.task.upsert({
      where: { id: task.id },
      update: {
        content: task.content,
        isTrackable: task.isTrackable,
        taskStat: task.taskStat,
        trackMap: task.trackMap,
      },
      create: task,
    });
  }
  console.log(`Seeded ${TASK_SEEDS.length} tasks`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
