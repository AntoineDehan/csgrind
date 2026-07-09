import type { Report, Task } from "../../generated/prisma/client";
import {
  STAT_DIRECTION,
  type StatDelta,
  type StatKey,
} from "../comparators/report_comparator";

export const MANUAL_TASK_COUNT = 5;
export const CHALLENGE_SLOTS = 2;

const DEFAULT_CHALLENGE_PCT = 0.1;
const CHALLENGE_PCT: Partial<Record<StatKey, number>> = {
  heFoesDamageAvg: 0.05,
};

export type SelectedChallenge = {
  taskId: string;
  trackCurrent: number;
  trackTarget: number;
};

export function selectManualTasks(tasks: Task[]): string[] {
  const pool = tasks.filter((task) => !task.isTrackable);
  return shuffle(pool)
    .slice(0, MANUAL_TASK_COUNT)
    .map((task) => task.id);
}

export function selectChallenges(
  deltas: StatDelta[],
  tasks: Task[],
  slots: number,
  report: Report,
  excludeStats: Set<string>,
): SelectedChallenge[] {
  if (slots <= 0) return [];

  const trackable = tasks.filter((task) => task.isTrackable && task.taskStat);

  const regressed = deltas
    .filter((delta) => !delta.improved && delta.previous !== 0)
    .map((delta) => ({
      stat: delta.stat,
      worsening: Math.abs(delta.delta) / Math.abs(delta.previous),
    }))
    .sort((a, b) => b.worsening - a.worsening);

  const challenges: SelectedChallenge[] = [];
  for (const { stat } of regressed) {
    if (challenges.length >= slots) break;
    if (excludeStats.has(stat)) continue;

    const candidates = trackable.filter((task) => task.taskStat === stat);
    if (candidates.length === 0) continue;

    const value = report[stat];
    if (value == null) continue;

    const current = Number(value);
    if (current === 0) continue;
    const task = candidates[Math.floor(Math.random() * candidates.length)]!;
    challenges.push({
      taskId: task.id,
      trackCurrent: current,
      trackTarget: challengeTarget(current, stat),
    });
    excludeStats.add(stat);
  }

  return challenges;
}

function challengeTarget(current: number, stat: StatKey): number {
  const pct = CHALLENGE_PCT[stat] ?? DEFAULT_CHALLENGE_PCT;
  return STAT_DIRECTION[stat] === "higher"
    ? current * (1 + pct)
    : current * (1 - pct);
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}
