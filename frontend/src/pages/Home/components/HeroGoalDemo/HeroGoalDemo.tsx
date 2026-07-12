import { useEffect, useState } from "react";
import GoalTracker from "../../../../components/ui/GoalTracker/GoalTracker";

const START_ELO = 12000;
const OBJECTIVE_ELO = 20000;

export default function HeroGoalDemo() {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const run = (value: number) => {
      setPercent(value);
      if (value >= 100) return;
      const delay = value === 0 ? 800 : 150;
      timer = setTimeout(() => {
        if (!cancelled) run(value + 1);
      }, delay);
    };

    run(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  const currentElo = Math.round(
    START_ELO + (percent / 100) * (OBJECTIVE_ELO - START_ELO),
  );

  return (
    <GoalTracker
      objective="PREMIER"
      startElo={START_ELO}
      currentElo={currentElo}
      objectiveElo={OBJECTIVE_ELO}
      percent={percent}
    />
  );
}
