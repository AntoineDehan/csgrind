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
import { formatDate } from "@/lib/date";

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
  const nextGoalDate = user?.createdAt;

  return (
    <Container>
      <div className="flex flex-col gap-6 pt-10">
        <div className="profile-details flex justify-between items-end mb-6">
          <div className="flex gap-3 items-center">
            {user?.image ? (
              <img
                src={user.image}
                alt={user.name ?? "Avatar"}
                className="size-24 shrink-0 rounded-full border border-background-secondary-border object-cover"
              />
            ) : (
              <div className="size-24 shrink-0 rounded-full border border-background-secondary-border bg-background-secondary" />
            )}
            <div>
              <Title>{user?.name ?? "Player"}</Title>
              <Text color="secondary">
                Member since {formatDate(nextGoalDate)}.
              </Text>
            </div>
          </div>
          <div className="pb-2">
            <Text color="secondary">{user?.steam64Id}</Text>
          </div>
        </div>

        <div className="flex-1">
          {goal ? (
            <GoalTracker
              objective={goal.matchmaking}
              startElo={stats?.startElo ?? null}
              currentElo={stats?.currentElo ?? null}
              objectiveElo={stats?.objectiveElo ?? goal.eloGoal}
              percent={percent}
              nextReportAt={stats?.nextReportAt}
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
