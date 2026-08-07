import { Link } from "react-router-dom";
import Container from "../../components/ui/Container/Container";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";
import Loader from "../../components/ui/Loader/Loader";
import Dot from "../../components/ui/Dot/Dot";
import { useReports } from "../../hooks/useReports";
import { useGoals } from "../../hooks/useGoals";
import { formatDate } from "@/lib/date";
import type { Goal } from "../../services/goals";
import type { Report } from "../../services/reports";

function statusLabel(status: Goal["status"]): string {
  if (status === "in_progress") return "In progress";
  if (status === "completed") return "Completed";
  return "Abandoned";
}

export default function Reports() {
  const { data: reports, isLoading: reportsLoading } = useReports();
  const { data: goals, isLoading: goalsLoading } = useGoals();

  if (reportsLoading || goalsLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      </Container>
    );
  }

  const reportsByGoal = new Map<string, Report[]>();
  for (const report of reports ?? []) {
    const list = reportsByGoal.get(report.goalId) ?? [];
    list.push(report);
    reportsByGoal.set(report.goalId, list);
  }
  for (const list of reportsByGoal.values()) {
    list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const orderedGoals = [...(goals ?? [])]
    .filter((goal) => (reportsByGoal.get(goal.id)?.length ?? 0) > 0)
    .sort((a, b) => {
      const aActive = a.status === "in_progress" ? 0 : 1;
      const bActive = b.status === "in_progress" ? 0 : 1;
      if (aActive !== bActive) return aActive - bActive;
      return b.createdAt.localeCompare(a.createdAt);
    });

  return (
    <Container>
      <div className="py-10">
        <Title>Reports</Title>

        {orderedGoals.length > 0 ? (
          <div className="mt-8 flex flex-col gap-10">
            {orderedGoals.map((goal) => {
              const goalReports = reportsByGoal.get(goal.id) ?? [];
              const active = goal.status === "in_progress";
              return (
                <section key={goal.id}>
                  <div className="mb-3 flex items-center gap-3 max-md:flex-wrap">
                    <Dot color={active ? "brand" : "secondary"} glow={active} />
                    <Text
                      span
                      mono
                      weight="bold"
                      className="uppercase tracking-wider"
                    >
                      {goal.matchmaking}
                    </Text>
                    <Text span size="small" color="secondary">
                      Target {goal.eloGoal.toLocaleString()}
                    </Text>
                    <Text
                      span
                      size="xsmall"
                      color={active ? "brand" : "secondary"}
                      className="uppercase tracking-wider"
                    >
                      · {statusLabel(goal.status)}
                    </Text>
                  </div>
                  <ul className="flex flex-col gap-3">
                    {goalReports.map((report) => (
                      <li key={report.id}>
                        <Link
                          to={`/reports/${report.id}`}
                          className="block rounded-md border border-background-secondary-border bg-background-secondary p-4 transition-colors hover:border-brand"
                        >
                          <Text>{formatDate(report.createdAt)}</Text>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <Text color="secondary">No reports yet.</Text>
        )}
      </div>
    </Container>
  );
}
