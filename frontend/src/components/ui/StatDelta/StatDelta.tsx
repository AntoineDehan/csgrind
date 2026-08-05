import styles from "./statdelta.module.css";

type StatDeltaProps = {
  value: number;
  improved: boolean;
};

export default function StatDelta({ value, improved }: StatDeltaProps) {
  const arrow = value >= 0 ? "↑" : "↓";
  const className = [
    styles.delta,
    improved ? styles["delta--up"] : styles["delta--down"],
  ].join(" ");

  return (
    <span className={className}>
      {arrow} {Math.abs(value)}
    </span>
  );
}
