import { useParams, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container/Container";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";
import Loader from "../../components/ui/Loader/Loader";
import Button from "../../components/ui/Button/Button";
import StatCompare from "../../components/ui/StatCompare/StatCompare";
import StatCompareContainer from "../../components/ui/StatCompareContainer/StatCompareContainer";
import { useReport } from "../../hooks/useReports";
import { useUser } from "../../auth/useAuth";
import type { Report as ReportType } from "../../services/reports";
import AimStat from "./components/aimStat";
import UtilityStat from "./components/utilityStat";
import GoalTracker from "@/components/ui/GoalTracker/GoalTracker";
import Badge from "@/components/ui/Badge/Badge";
import BadgeContainer from "@/components/ui/BadgeContainer/BadgeContainer";
import TipsCollapse from "@/components/ui/TipsCollapse/TipsCollapse";
import TaskList from "@/components/ui/TaskList/TaskList";
import { useBadges, useUserBadges } from "@/hooks/useBadges";
import { formatDate } from "@/lib/date";
import PosStat from "./components/posStat";
import Dot from "@/components/ui/Dot/Dot";
import Section from "@/components/ui/Section/Section";
import leetifyLogo from "../../assets/Leetify.png";

type StatField = {
  key: keyof ReportType;
  label: string;
  unit: string;
  decimals: number;
  scale?: number;
  prefix?: string;
};

const STAT_FIELDS: StatField[] = [
  { key: "leetifyRating", label: "Leetify Rating", unit: "", decimals: 2 },
  { key: "aimRating", label: "Aim", unit: "", decimals: 0 },
  { key: "utilityRating", label: "Utility", unit: "", decimals: 0 },
  { key: "positioningRating", label: "Positioning", unit: "", decimals: 0 },
  { key: "premierRank", label: "Premier", unit: "", decimals: 0 },
  { key: "faceitRank", label: "FACEIT", unit: "", decimals: 0 },
  { key: "accuracyHead", label: "Headshot Accuracy", unit: "%", decimals: 0 },
  {
    key: "accuracyEnemySpotted",
    label: "Spotted Accuracy",
    unit: "%",
    decimals: 0,
  },
  { key: "sprayAccuracy", label: "Spray Accuracy", unit: "%", decimals: 0 },
  {
    key: "counterStrafingRatio",
    label: "Counter-Strafing",
    unit: "%",
    decimals: 0,
  },
  { key: "preaim", label: "Crosshair Placement", unit: "°", decimals: 2 },
  { key: "reactionTimeMs", label: "Time to Damage", unit: " ms", decimals: 0 },
  { key: "flashHitPerFlash", label: "Enemies flashed", unit: "", decimals: 2 },
  {
    key: "flashAvgDuration",
    label: "Average blind time",
    unit: " sec",
    decimals: 1,
  },
  { key: "flashLeadingToKill", label: "Flash Assists", unit: "%", decimals: 0 },
  { key: "heFoesDamageAvg", label: "Average HE damage", unit: "", decimals: 2 },
  {
    key: "utilityOnDeathAvg",
    label: "Average unused utility",
    unit: "",
    prefix: "$",
    decimals: 0,
  },
  {
    key: "ctOpeningSuccess",
    label: "CT Opening Duels Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tOpeningSuccess",
    label: "T Opening Duels Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tradeKillsSuccess",
    label: "Trade Kills Success",
    unit: "%",
    decimals: 0,
  },
  {
    key: "tradeDeathsSuccess",
    label: "Traded Deaths Success",
    unit: "%",
    decimals: 0,
  },
  { key: "winrate", label: "Win Rate", unit: "%", scale: 100, decimals: 0 },
  { key: "totalMatches", label: "Total matches", unit: "", decimals: 0 },
];

const AIM_GROUP: string[] = [
  "aimRating",
  "accuracyHead",
  "accuracyEnemySpotted",
  "sprayAccuracy",
  "reactionTimeMs",
  "tOpeningSuccess",
];

const UTIL_GROUP: string[] = [
  "utilityRating",
  "flashHitPerFlash",
  "flashAvgDuration",
  "flashLeadingToKill",
  "heFoesDamageAvg",
  "utilityOnDeathAvg",
];

const POS_GROUP: string[] = [
  "positioningRating",
  "counterStrafingRatio",
  "preaim",
  "tradeKillsSuccess",
  "tradeDeathsSuccess",
  "ctOpeningSuccess",
];

function formatStat(value: number, field: StatField): string {
  const { decimals, unit, scale = 1, prefix = "" } = field;
  const factor = 10 ** decimals;
  const rounded = Math.round(value * scale * factor) / factor;
  return `${prefix}${rounded}${unit}`;
}

function formatDelta(value: number, field: StatField): string {
  const formatted = formatStat(value, field);
  return value >= 0 ? `+${formatted}` : formatted;
}

export default function Report() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useReport(reportId);
  const { data: user } = useUser();
  const { data: userBadges } = useUserBadges();
  const { data: allBadges } = useBadges();

  if (isLoading) {
    return (
      <Container>
        <div className="flex justify-center py-20">
          <Loader size="large" />
        </div>
      </Container>
    );
  }

  if (error || !report) {
    return (
      <Container>
        <div className="py-10">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <div className="mt-4">
            <Text color="secondary">
              {error instanceof Error ? error.message : "Report not found."}
            </Text>
          </div>
        </div>
      </Container>
    );
  }

  const reportDay = formatDate(report.createdAt);
  const newBadges =
    userBadges?.filter((entry) => formatDate(entry.obtainedAt) === reportDay) ??
    [];

  const remainingBadges = (allBadges?.length ?? 0) - newBadges.length;

  const comparison = report.comparison;
  type Delta = (typeof comparison)[number];
  function topByRatio(improved: boolean): Delta | null {
    let best: Delta | null = null;
    let bestRatio = 0;
    for (const entry of comparison) {
      if (entry.improved !== improved) continue;
      if (entry.delta === 0 || entry.previous === 0) continue;
      const ratio = Math.abs(entry.delta / entry.previous);
      if (ratio > bestRatio) {
        bestRatio = ratio;
        best = entry;
      }
    }
    return best;
  }

  const highlights = [topByRatio(true), topByRatio(false)].filter(
    (entry): entry is Delta => entry !== null,
  );

  const tips = report.tips;
  const tipsFor = (group: string[]) =>
    tips
      .filter(({ tip }) => group.includes(tip.category))
      .map(({ tip }) => tip);
  const aimTips = tipsFor(AIM_GROUP);
  const utilTips = tipsFor(UTIL_GROUP);
  const posTips = tipsFor(POS_GROUP);

  return (
    <Container>
      <div className="py-10">
        <div className="mb-10">
          <div className="flex gap-1 mb-2 items-center">
            <div className="mr-2">
              <Dot color="brand" glow></Dot>
            </div>
            <Text size="xsmall" color="brand">
              report n°{report.index}
            </Text>
            <Text size="xsmall" color="secondary">
              -
            </Text>
            <Text size="xsmall" color="secondary">
              {new Date(report.createdAt).toLocaleDateString()}
            </Text>
          </div>
          <Title>
            Here is your latest report.{" "}
            <span className="colored-text">Keep Grinding.</span>
          </Title>
        </div>
        <div className="flex justify-between items-end mb-2 mt-2">
          <a href="https://leetify.com/">
            <img
              src={leetifyLogo}
              alt="Powered by Leetify"
              className="h-8 w-auto "
            />
          </a>
          <a
            href={
              user?.steam64Id
                ? `https://leetify.com/app/profile/${user.steam64Id}`
                : "https://leetify.com/"
            }
            target="_blank"
            rel="noreferrer"
          >
            <Text size="small" color="leetify" className="underline">
              View on Leetify
            </Text>
          </a>
        </div>

        {report.progress && (
          <GoalTracker
            objective={report.progress.matchmaking}
            startElo={report.progress.startElo}
            currentElo={report.progress.currentElo}
            objectiveElo={report.progress.objectiveElo}
            percent={report.progress.percent}
          />
        )}

        <div className="flex justify-between">
          {newBadges.length > 0 && (
            <section className="mt-8">
              <Title level="h2">Badges unlocked</Title>
              <div className="mt-4">
                <BadgeContainer maxCount={remainingBadges} variant="compact">
                  {newBadges.map((entry) => (
                    <Badge
                      key={entry.badge.id}
                      icon={entry.badge.icon}
                      name={entry.badge.name}
                      description={entry.badge.description}
                      new
                      compact
                    />
                  ))}
                </BadgeContainer>
              </div>
            </section>
          )}

          {highlights.length > 0 && (
            <section className="mt-8">
              <div className="flex justify-end">
                <Title level="h2">Highlights</Title>
              </div>
              <div className="mt-4">
                <StatCompareContainer>
                  {highlights.map((entry) => {
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
                  })}
                </StatCompareContainer>
              </div>
            </section>
          )}
        </div>

        <div className="mt-6">
          {report.comparison.length > 0 && (
            <AimStat>
              {report.comparison
                .filter((entry) => AIM_GROUP.includes(entry.stat))
                .map((entry) => {
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
                })}
            </AimStat>
          )}
          {aimTips.length > 0 && (
            <div className="mt-2 mb-5">
              <TipsCollapse category="Aim" tips={aimTips} />
            </div>
          )}
        </div>
        <div className="mt-6">
          {report.comparison.length > 0 && (
            <UtilityStat>
              {report.comparison
                .filter((entry) => UTIL_GROUP.includes(entry.stat))
                .map((entry) => {
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
                })}
            </UtilityStat>
          )}
          {utilTips.length > 0 && (
            <div className="mt-2 mb-5">
              <TipsCollapse category="Utility" tips={utilTips} />
            </div>
          )}
        </div>
        <div className="mt-6">
          {report.comparison.length > 0 && (
            <PosStat>
              {report.comparison
                .filter((entry) => POS_GROUP.includes(entry.stat))
                .map((entry) => {
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
                })}
            </PosStat>
          )}
          {posTips.length > 0 && (
            <div className="mt-2 mb-20">
              <TipsCollapse category="Positioning" tips={posTips} />
            </div>
          )}
        </div>

        <Section
          title="Your to-do list"
          subtitle="Two long-term challenges, five short-term tasks. Can you do them all ? "
        >
          <TaskList goalId={report.goalId} />
        </Section>
        <div className="mt-20"></div>
      </div>
    </Container>
  );
}
