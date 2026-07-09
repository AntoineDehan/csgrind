import type { ReactNode } from "react";
import Title from "../Title/Title";
import Text from "../Text/Text";
import { Progress } from "@/components/ui/progress";
import styles from "./goaltracker.module.css";

type GoalTrackerProps = {
  objective: ReactNode;
  startElo: number | null;
  currentElo: number | null;
  objectiveElo: number;
  percent: number;
  nextReportAt?: string;
};

function formatNextReport(nextReportAt?: string): string {
  if (!nextReportAt) return "—";
  const days = Math.ceil(
    (new Date(nextReportAt).getTime() - Date.now()) / 86_400_000,
  );
  if (days <= 0) return "soon";
  return days === 1 ? "1 day" : `${days} days`;
}

export default function GoalTracker({
  objective,
  startElo,
  currentElo,
  objectiveElo,
  percent,
  nextReportAt,
}: GoalTrackerProps) {
  return (
    <div className={styles.tracker}>
      <div className={styles.header}>
        <Title level="h3">Current objective :</Title>
        <Title level="h3">{objective}</Title>
      </div>

      <div className={styles.progress}>
        <Progress value={percent} />
        <div className={styles.labels}>
          <Text span size="small" color="secondary">
            START ELO · {startElo ?? "—"}
          </Text>
          <Text span size="small" color="brand">
            {currentElo ?? "—"} · {percent}%
          </Text>
          <Text span size="small" color="secondary">
            OBJCTV ELO · {objectiveElo}
          </Text>
        </div>
      </div>
      <div className="bottom-details border-t border-background-secondary-border mt-3 mb-0 pt-2">
        <Text size="small" color="secondary">
          Next report in :
          <span className="colored-text">
            {" "}
            {formatNextReport(nextReportAt)}
          </span>
        </Text>
      </div>
    </div>
  );
}
