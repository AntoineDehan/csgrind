import { Children, type ReactNode } from "react";
import Text from "../Text/Text";

type BadgeContainerVariant = "default" | "compact";

type BadgeContainerProps = {
  children: ReactNode;
  maxCount: number;
  variant?: BadgeContainerVariant;
};

const DEFAULT_VARIANT: BadgeContainerVariant = "default";

export default function BadgeContainer({
  children,
  maxCount,
  variant = DEFAULT_VARIANT,
}: BadgeContainerProps) {
  const count = Children.count(children);
  const compact = variant === "compact";

  return (
    <div
      className={`rounded-lg border border-background-secondary-border bg-card ${
        compact ? "w-fit p-4" : "p-8"
      }`}
    >
      <div
        className={`flex w-full items-center justify-end ${compact ? "justify-start" : ""}`}
      >
        {compact ? (
          <></>
        ) : (
          <Text color="secondary">
            <span className="colored-text">{count} unlocked</span> of {maxCount}
          </Text>
        )}
      </div>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}
