import type { Report } from "../../generated/prisma/client";
import { matches, type Comparator } from "./rule";

type TaskRule = {
  stat: keyof Report;
  comparator: Comparator;
  threshold: number;
  taskId: string;
  target?: number;
};

export type SelectedTask = {
  taskId: string;
  trackCurrent: number | null;
  trackTarget: number | null;
};

const TASK_RULES: TaskRule[] = [
  {
    stat: "accuracyHead",
    comparator: "lt",
    threshold: 0.2,
    taskId: "task-aim-botz",
    target: 0.3,
  },
  {
    stat: "reactionTimeMs",
    comparator: "gt",
    threshold: 700,
    taskId: "task-prefire",
    target: 600,
  },
];

export function selectTasks(report: Report): SelectedTask[] {
  return TASK_RULES.filter((rule) => {
    const value = report[rule.stat];
    if (value == null) return false;
    return matches(Number(value), rule.comparator, rule.threshold);
  }).map((rule) => {
    const value = report[rule.stat];
    return {
      taskId: rule.taskId,
      trackCurrent: rule.target != null && value != null ? Number(value) : null,
      trackTarget: rule.target ?? null,
    };
  });
}
