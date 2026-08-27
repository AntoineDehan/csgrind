import { findUsersWithSteam } from "../repositories/user.repository";
import { deleteReportsByUser } from "../repositories/report.repository";
import { checkLeetifyProfileExists } from "../lib/leetify";
import { recordJobRun } from "../repositories/jobRun.repository";

export async function runLeetifyAccountCheck() {
  const startedAt = new Date();
  const users = await findUsersWithSteam();

  let checked = 0;
  let purged = 0;
  let skipped = 0;

  for (const user of users) {
    if (!user.steam64Id) continue;

    const status = await checkLeetifyProfileExists(user.steam64Id);
    checked++;

    if (status === "gone") {
      try {
        await deleteReportsByUser(user.id);
        purged++;
        console.log(
          `Leetify account gone for user ${user.id} — reports deleted`,
        );
      } catch (error) {
        console.error(`Failed to delete reports for user ${user.id}:`, error);
      }
    } else if (status === "unknown") {
      skipped++;
    }
  }

  console.log(
    `Leetify account check: ${checked} checked, ${purged} purged, ${skipped} skipped`,
  );

  await recordJobRun({
    job: "leetify-account-check",
    startedAt,
    result: { checked, purged, skipped },
  });

  return { checked, purged, skipped };
}
