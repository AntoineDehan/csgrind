import { useParams, useNavigate } from "react-router-dom";
import Container from "../components/ui/Container/Container";
import Title from "../components/ui/Title/Title";
import Text from "../components/ui/Text/Text";
import Loader from "../components/ui/Loader/Loader";
import Button from "../components/ui/Button/Button";
import { useReport } from "../hooks/useReports";
import type { Report as ReportType } from "../services/reports";

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

function formatStat(value: number, field: StatField): string {
  const { decimals, unit, scale = 1, prefix = "" } = field;
  const factor = 10 ** decimals;
  const rounded = Math.round(value * scale * factor) / factor;
  return `${prefix}${rounded}${unit}`;
}

export default function Report() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { data: report, isLoading, error } = useReport(reportId);

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

  return (
    <Container>
      <div className="py-10">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Back
        </Button>

        <div className="mt-4">
          <Title>
            Report — {new Date(report.createdAt).toLocaleDateString()}
          </Title>
        </div>

        <section className="mt-8">
          <Title level="h2">Tips</Title>
          {report.tips.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {report.tips.map(({ tip }) => (
                <li
                  key={tip.id}
                  className="rounded-md border border-background-secondary-border bg-background-secondary p-4"
                >
                  <Text span size="small" color="secondary">
                    {tip.category}
                  </Text>
                  <Text>{tip.content}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text color="secondary">No tips for this report.</Text>
          )}
        </section>

        <section className="mt-8">
          <Title level="h2">Stats</Title>
          <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-1 max-sm:grid-cols-1">
            {STAT_FIELDS.map((field) => {
              const value = report[field.key];
              if (typeof value !== "number") return null;
              return (
                <div
                  key={field.key}
                  className="flex justify-between border-b border-background-secondary-border py-1"
                >
                  <Text span size="small" color="secondary">
                    {field.label}
                  </Text>
                  <Text span size="small">
                    {formatStat(value, field)}
                  </Text>
                </div>
              );
            })}
          </dl>
        </section>
      </div>
    </Container>
  );
}
