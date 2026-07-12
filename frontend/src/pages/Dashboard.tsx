import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useUser } from "../auth/useAuth";
import { startSteamLink } from "../services/steam";
import { useGoals, useGoalStats } from "../hooks/useGoals";
import { useReports } from "../hooks/useReports";
import Container from "../components/ui/Container/Container";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import Button from "../components/ui/Button/Button";
import GoalTracker from "../components/ui/GoalTracker/GoalTracker";
import TaskList from "../components/ui/TaskList/TaskList";
import type { EloPoint } from "../components/ui/EloChart/EloChart";
import { formatDate } from "../lib/date";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: goals } = useGoals();
  const activeGoal = goals?.find((goal) => goal.status === "in_progress");
  const { data: stats } = useGoalStats(activeGoal?.id);
  const { data: reports } = useReports();

  const steamMutation = useMutation({
    mutationFn: startSteamLink,
    onSuccess: ({ url }) => {
      window.location.href = url;
    },
  });

  const recentReports = reports
    ? [...reports]
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .slice(0, 5)
    : [];

  const eloField =
    activeGoal?.matchmaking === "PREMIER" ? "premierRank" : "faceitRank";
  const goalHistory: EloPoint[] =
    reports && activeGoal
      ? [...reports]
          .filter((report) => report.goalId === activeGoal.id)
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
          .map((report) => ({
            label: formatDate(report.createdAt),
            elo: report[eloField],
          }))
          .filter((point): point is EloPoint => point.elo != null)
      : [];
  const history: EloPoint[] =
    stats?.startElo != null
      ? [{ label: "Start", elo: stats.startElo }, ...goalHistory]
      : goalHistory;

  return (
    <Container>
      <div className="flex flex-col gap-8 py-10">
        <div className="top-detail-content">
          <Text color="secondary">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </Text>
          <Title>Dashboard</Title>

          <Button variant="cta">Latest Report</Button>
          <Text>ici elo Faceit si elo Faceit</Text>
          <Text>ici elo Premier si elo premier</Text>
          <Text>Afficher winrate et/ou leetify rating en plus?</Text>
        </div>

        {!user?.steam64Id ? (
          <div className="rounded-lg border border-background-secondary-border bg-card p-8">
            <Title level="h2">Link your Steam account</Title>
            <div className="mt-2">
              <Text color="secondary">
                Connect Steam to start tracking your CS2 progress.
              </Text>
            </div>
            <div className="mt-4">
              <Button
                variant="cta"
                onClick={() => steamMutation.mutate()}
                disabled={steamMutation.isPending}
              >
                Link Steam
              </Button>
            </div>
          </div>
        ) : !activeGoal ? (
          <div className="rounded-lg border border-background-secondary-border bg-card p-8">
            <Title level="h2">Set your first goal</Title>
            <div className="mt-2">
              <Text color="secondary">
                Pick a rank objective and we'll generate your reports.
              </Text>
            </div>
            <div className="mt-4"></div>
          </div>
        ) : (
          <>
            <section>
              <div className="flex items-center justify-between">
                <Title level="h2">Your goal</Title>
                <Link to="/set-goal">
                  <Button variant="secondary">New goal</Button>
                </Link>
              </div>
              <div className="mt-4">
                <GoalTracker
                  objective={activeGoal.matchmaking}
                  startElo={stats?.startElo ?? null}
                  currentElo={stats?.currentElo ?? null}
                  objectiveElo={stats?.objectiveElo ?? activeGoal.eloGoal}
                  percent={stats?.percent ?? 0}
                  nextReportAt={stats?.nextReportAt}
                  detailed
                  history={history}
                />
              </div>
            </section>

            <section>
              <Title level="h2">This week's to-do</Title>
              <div className="mt-4">
                <TaskList goalId={activeGoal.id} />
              </div>
            </section>
          </>
        )}

        <section>
          <Title level="h2">Recent reports</Title>
          <div className="mt-4">
            {recentReports.length > 0 ? (
              <ul className="divide-y divide-background-secondary-border rounded-lg border border-background-secondary-border bg-card">
                {recentReports.map((report) => (
                  <li key={report.id}>
                    <Link
                      to={`/reports/${report.id}`}
                      className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-background-secondary"
                    >
                      <Text span>Report — {formatDate(report.createdAt)}</Text>
                      <ChevronRight className="size-4 text-text-secondary" />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-lg border border-background-secondary-border bg-card px-6 py-4">
                <Text color="secondary">No reports yet.</Text>
              </div>
            )}
          </div>
        </section>
      </div>
    </Container>
  );
}
