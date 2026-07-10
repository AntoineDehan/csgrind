import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLOR = "#53ca65";

export type EloPoint = {
  label: string;
  elo: number;
};

type EloChartProps = {
  data: EloPoint[];
};

export default function EloChart({ data }: EloChartProps) {
  const values = data.map((point) => point.elo);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max(10, Math.round((max - min) * 0.15));

  return (
    <ResponsiveContainer width="100%" height={140}>
      <AreaChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="eloFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.4} />
            <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" hide />
        <YAxis hide domain={[min - pad, max + pad]} />
        <Tooltip
          contentStyle={{
            background: "var(--color-background-secondary)",
            border: "1px solid var(--color-background-secondary-border)",
            borderRadius: "8px",
            fontSize: "12px",
          }}
          labelStyle={{ color: "var(--color-text-secondary)" }}
          itemStyle={{ color: CHART_COLOR }}
          formatter={(value) => [value, "Elo"]}
        />
        <Area
          type="monotone"
          dataKey="elo"
          stroke={CHART_COLOR}
          strokeWidth={2}
          fill="url(#eloFill)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
