import Container from "../components/ui/Container/Container";
import Section from "../components/ui/Section/Section";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import Loader from "../components/ui/Loader/Loader";
import { Card, CardContent } from "@/components/ui/card";
import { useGoals, useGoalStats } from "../hooks/useGoals";
import { useUser } from "../auth/useAuth";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const goal = goals?.find((g) => g.status === "in_progress");
  const { data: stats } = useGoalStats(goal?.id);

  if (userLoading || goalsLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      </Container>
    );
  }

  const percent = stats?.percent ?? 0;

  return (
    <Container>
      <div className="flex gap-6 py-10">
        {user?.image ? (
          <img
            src={user.image}
            alt={user.name ?? "Avatar"}
            className="size-16 shrink-0 rounded-full border border-background-secondary-border object-cover"
          />
        ) : (
          <div className="size-16 shrink-0 rounded-full border border-background-secondary-border bg-background-secondary" />
        )}

        <div className="flex-1">
          <div className="mb-6">
            <Title level="h1">{user?.name ?? "Player"}</Title>
          </div>

          <Card className="border-background-secondary-border">
            <CardContent>
              {goal ? (
                <>
                  <div className="flex items-baseline justify-between">
                    <Text size="large" weight="medium">
                      Current objective :
                    </Text>
                    <Title level="h2">{goal.matchmaking}</Title>
                  </div>

                  <div className="mt-6">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-background-secondary-border">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between">
                      <Text span size="small" color="secondary">
                        START ELO · {stats?.startElo ?? "—"}
                      </Text>
                      <Text span size="small" color="secondary">
                        {stats?.currentElo ?? "—"} · {percent}%
                      </Text>
                      <Text span size="small" color="secondary">
                        OBJCTV ELO · {stats?.objectiveElo ?? goal.eloGoal}
                      </Text>
                    </div>
                  </div>
                </>
              ) : (
                <Text color="secondary">No active goal yet.</Text>
              )}
            </CardContent>
          </Card>

          <Section title="Badges" className="mt-8">
            <Card className="border-background-secondary-border">
              <CardContent>
                <Text color="secondary">No badges yet.</Text>
              </CardContent>
            </Card>
          </Section>
        </div>
      </div>
    </Container>
  );
}
