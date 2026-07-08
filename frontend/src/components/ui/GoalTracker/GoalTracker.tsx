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
};

export default function GoalTracker({
  objective,
  startElo,
  currentElo,
  objectiveElo,
  percent,
}: GoalTrackerProps) {
  return (
    <div className={styles.tracker}>
      <div className={styles.header}>
        <Text size="large" weight="medium">
          Current objective :
        </Text>
        <Title level="h2">{objective}</Title>
      </div>

      <div className={styles.progress}>
        <Progress value={percent} />
        <div className={styles.labels}>
          <Text span size="small" color="secondary">
            START ELO · {startElo ?? "—"}
          </Text>
          <Text span size="small" color="secondary">
            {currentElo ?? "—"} · {percent}%
          </Text>
          <Text span size="small" color="secondary">
            OBJCTV ELO · {objectiveElo}
          </Text>
        </div>
      </div>
    </div>
  );
}
