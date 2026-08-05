export type Comparator = "lt" | "gt" | "lte" | "gte";

export function matches(
  value: number,
  comparator: Comparator,
  threshold: number,
): boolean {
  switch (comparator) {
    case "lt":
      return value < threshold;
    case "gt":
      return value > threshold;
    case "lte":
      return value <= threshold;
    case "gte":
      return value >= threshold;
  }
}
