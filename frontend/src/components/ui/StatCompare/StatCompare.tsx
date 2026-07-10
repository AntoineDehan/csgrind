type StatCompareProps = {
  label: string;
  delta: string;
  current: string;
  previous: string;
  improved: boolean;
};

export default function StatCompare({
  label,
  delta,
  current,
  previous,
  improved,
}: StatCompareProps) {
  return (
    <div className="flex h-full flex-col gap-1 bg-background-secondary px-6 py-4">
      <span className="text-xs min-h-8 font-medium uppercase tracking-wider text-text-secondary">
        {label}
      </span>
      <span
        className={`text-3xl font-bold ${improved ? "text-success" : "text-destructive"}`}
      >
        {delta}
      </span>
      <span className="text-xs text-text-secondary">
        {current} · from {previous}
      </span>
    </div>
  );
}
