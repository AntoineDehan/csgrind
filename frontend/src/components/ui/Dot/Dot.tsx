import type { Color } from "../types";

type DotProps = {
  color: Color;
  glow?: boolean;
};

const DEFAULT_GLOW = false;

function colorVar(color: Color): string {
  if (color === "brand") return "var(--color-brand)";
  if (color === "secondary") return "var(--color-text-secondary)";
  return "var(--color-text-primary)";
}

export default function Dot({ color, glow = DEFAULT_GLOW }: DotProps) {
  const value = colorVar(color);

  return (
    <span
      className={`inline-block size-2.5 rounded-full ${glow ? "animate-glow-pulse" : ""}`}
      style={{
        backgroundColor: value,
        color: value,
      }}
    />
  );
}
