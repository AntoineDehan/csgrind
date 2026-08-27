import { getLogDb } from "../lib/mongo";

export type JobName = "report-scheduler" | "leetify-account-check";

export type JobRun = {
  job: JobName;
  startedAt: Date;
  finishedAt: Date;
  durationMs: number;
  result: Record<string, number>;
};

export async function recordJobRun(input: {
  job: JobName;
  startedAt: Date;
  result: Record<string, number>;
}): Promise<void> {
  try {
    const db = await getLogDb();
    if (!db) return;

    const finishedAt = new Date();
    await db.collection<JobRun>("job_runs").insertOne({
      job: input.job,
      startedAt: input.startedAt,
      finishedAt,
      durationMs: finishedAt.getTime() - input.startedAt.getTime(),
      result: input.result,
    });
  } catch (error) {
    console.error(`Could not record the ${input.job} run:`, error);
  }
}
