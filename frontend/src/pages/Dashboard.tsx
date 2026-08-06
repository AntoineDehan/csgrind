import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useUser } from "../auth/useAuth";
import { useGoals, useGoalStats } from "../hooks/useGoals";
import { useReports, useReport } from "../hooks/useReports";
import Container from "../components/ui/Container/Container";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import Button from "../components/ui/Button/Button";
import GoalTracker from "../components/ui/GoalTracker/GoalTracker";
import TaskList from "../components/ui/TaskList/TaskList";
import StatCompare from "../components/ui/StatCompare/StatCompare";
import StatCompareContainer from "../components/ui/StatCompareContainer/StatCompareContainer";
import Modal from "../components/ui/Modal/Modal";
import ConfirmModal from "../components/ui/ConfirmModal/ConfirmModal";
import GoalForm from "../components/GoalForm/GoalForm";
import type { EloPoint } from "../components/ui/EloChart/EloChart";
import { formatDate } from "../lib/date";
import { STAT_FIELDS, formatStat, formatDelta } from "../lib/statFields";

const LEFT_KEYS = ["leetifyRating", "winrate"];
const RIGHT_KEYS = ["faceitRank", "premierRank"];

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: goals } = useGoals();
  const activeGoal = goals?.find((goal) => goal.status === "in_progress");
  const { data: stats } = useGoalStats(activeGoal?.id);
  const { data: reports } = useReports();
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const latestReportId = recentReports[0]?.id;
  const { data: latestReport } = useReport(latestReportId);

  type Delta = NonNullable<typeof latestReport>["comparison"][number];
  const statsFor = (keys: string[]): Delta[] => {
    const detail = latestReport;
    if (!detail) return [];
    return keys.flatMap((key) => {
      const entry = detail.comparison.find((e) => e.stat === key);
      return entry ? [entry] : [];
    });
  };
  const leftStats = statsFor(LEFT_KEYS);
  const rightStats = statsFor(RIGHT_KEYS);

  const renderStat = (entry: Delta) => {
    const field = STAT_FIELDS.find((f) => f.key === entry.stat);
    if (!field) return null;
    return (
      <StatCompare
        key={entry.stat}
        label={field.label}
        delta={formatDelta(entry.delta, field)}
        current={formatStat(entry.current, field)}
        previous={formatStat(entry.previous, field)}
        improved={entry.improved}
      />
    );
  };

  if (user && !user.steam64Id) {
    return <Navigate to="/steam-link" replace />;
  }

  return (
    <Container>
      <div className="flex flex-col gap-8 py-10">
        <div className="top-detail-content">
          <Title level="h3">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </Title>
          <Title>
            Ready to <span className="colored-text">Grind</span> ?
          </Title>
          <div className="flex gap-4 mt-5">
            {latestReportId && (
              <Link to={`/reports/${latestReportId}`}>
                <Button variant="cta">Latest Report</Button>
              </Link>
            )}
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
              New goal
            </Button>
          </div>
        </div>
        {(leftStats.length > 0 || rightStats.length > 0) && (
          <div className="flex justify-between gap-8 max-md:flex-col max-md:gap-4">
            {leftStats.length > 0 && (
              <StatCompareContainer>
                {leftStats.map(renderStat)}
              </StatCompareContainer>
            )}
            {rightStats.length > 0 && (
              <StatCompareContainer>
                {rightStats.map(renderStat)}
              </StatCompareContainer>
            )}
          </div>
        )}

        {!activeGoal ? (
          <div className="rounded-lg border border-background-secondary-border bg-card p-8">
            <Title level="h2">Set your first goal</Title>
            <div className="mt-2">
              <Text color="secondary">
                Pick a rank objective and we'll generate your reports.
              </Text>
            </div>
            <div className="mt-4">
              <Button variant="cta" onClick={() => setGoalModalOpen(true)}>
                Set a goal
              </Button>
            </div>
          </div>
        ) : (
          <>
            <section>
              <div className="flex items-center justify-between">
                <Title level="h2">Your goal</Title>
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

        <ConfirmModal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          onConfirm={() => {
            setConfirmOpen(false);
            setGoalModalOpen(true);
          }}
          title="You already have a goal"
          message="Setting a new one will abandon your current goal. Are you sure you want to continue?"
          confirmLabel="Set a new goal"
        />

        <Modal
          open={goalModalOpen}
          onClose={() => setGoalModalOpen(false)}
          title="Create a goal"
        >
          <GoalForm onSuccess={() => setGoalModalOpen(false)} />
        </Modal>
      </div>
    </Container>
  );
}
