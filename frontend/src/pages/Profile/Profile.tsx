import Container from "../../components/ui/Container/Container";
import Section from "../../components/ui/Section/Section";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";
import Loader from "../../components/ui/Loader/Loader";
import GoalTracker from "../../components/ui/GoalTracker/GoalTracker";
import BadgeContainer from "../../components/ui/BadgeContainer/BadgeContainer";
import Badge from "../../components/ui/Badge/Badge";
import ProfileContainer from "./components/ProfileContainer/ProfileContainer";
import { useGoals, useGoalStats } from "../../hooks/useGoals";
import { useBadges, useUserBadges } from "../../hooks/useBadges";
import { useUser } from "../../auth/useAuth";

export default function Profile() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: goals, isLoading: goalsLoading } = useGoals();
  const goal = goals?.find((g) => g.status === "in_progress");
  const { data: stats } = useGoalStats(goal?.id);
  const { data: badges } = useUserBadges();
  const { data: allBadges } = useBadges();

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
            <Title>{user?.name ?? "Player"}</Title>
          </div>

          {goal ? (
            <GoalTracker
              objective={goal.matchmaking}
              startElo={stats?.startElo ?? null}
              currentElo={stats?.currentElo ?? null}
              objectiveElo={stats?.objectiveElo ?? goal.eloGoal}
              percent={percent}
            />
          ) : (
            <ProfileContainer>
              <Text color="secondary">No active goal yet.</Text>
            </ProfileContainer>
          )}

          <Section title="Badges" className="mt-8">
            <BadgeContainer maxCount={allBadges?.length ?? 0}>
              {badges?.map((entry) => (
                <Badge
                  key={entry.badge.id}
                  icon={entry.badge.icon}
                  name={entry.badge.name}
                  description={entry.badge.description}
                />
              ))}
            </BadgeContainer>
          </Section>
        </div>
      </div>
    </Container>
  );
}
