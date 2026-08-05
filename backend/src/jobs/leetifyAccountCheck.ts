import { findUsersWithSteam } from "../repositories/user.repository";
import { deleteReportsByUser } from "../repositories/report.repository";
import { checkLeetifyProfileExists } from "../lib/leetify";

export async function runLeetifyAccountCheck() {
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

  return { checked, purged, skipped };
}
