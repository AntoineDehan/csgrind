import Title from "../../../../components/ui/Title/Title";
import Text from "../../../../components/ui/Text/Text";
import StatCompare from "../../../../components/ui/StatCompare/StatCompare";
import TipsCollapse from "../../../../components/ui/TipsCollapse/TipsCollapse";

const SAMPLE_STATS = [
  {
    label: "Preaim",
    delta: "-0.8°",
    current: "3.8°",
    previous: "4.6°",
    improved: true,
  },
  {
    label: "Reaction",
    delta: "-16 ms",
    current: "524 ms",
    previous: "540 ms",
    improved: true,
  },
  {
    label: "Spray",
    delta: "-2%",
    current: "41%",
    previous: "43%",
    improved: false,
  },
  {
    label: "HS / Kill",
    delta: "+3%",
    current: "54%",
    previous: "51%",
    improved: true,
  },
  {
    label: "Trade %",
    delta: "+5%",
    current: "64%",
    previous: "59%",
    improved: true,
  },
  {
    label: "Rating",
    delta: "+5",
    current: "74",
    previous: "69",
    improved: true,
  },
];

const SAMPLE_TIPS = [
  {
    id: "1",
    content:
      "Your preaim on B sites sits ~8° high — run head-only aim_botz 10 min before queueing.",
  },
  {
    id: "2",
    content:
      "You peek solo after first contact — swing retakes with a teammate to win more trades.",
  },
];

export default function ReportPreview() {
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-background-secondary-border bg-card">
      <div className="bg-linear-to-r from-brand/10 to-transparent px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Text
              span
              size="xsmall"
              mono
              color="brand"
              className="uppercase tracking-wider"
            >
              Weekly report · N°043
            </Text>
            <Title level="h3">
              Aim's tightening up.{" "}
              <span className="colored-text">Keep the drills landing.</span>
            </Title>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <Text
              span
              size="xsmall"
              color="secondary"
              className="uppercase tracking-wider"
            >
              May 12 → May 19
            </Text>
          </div>
        </div>
      </div>

      <div className="flex divide-x divide-background-secondary-border overflow-x-auto border-t border-background-secondary-border">
        {SAMPLE_STATS.map((stat) => (
          <div key={stat.label} className="flex-1">
            <StatCompare
              label={stat.label}
              delta={stat.delta}
              current={stat.current}
              previous={stat.previous}
              improved={stat.improved}
            />
          </div>
        ))}
      </div>

      <div className="border-t border-background-secondary-border p-4">
        <TipsCollapse category="Aim" tips={SAMPLE_TIPS} />
      </div>
    </div>
  );
}
