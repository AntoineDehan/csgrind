import { Children, type ReactNode } from "react";
import Text from "../Text/Text";

type BadgeContainerProps = {
  children: ReactNode;
  maxCount: number;
};

export default function BadgeContainer({
  children,
  maxCount,
}: BadgeContainerProps) {
  const count = Children.count(children);
  return (
    <div className="rounded-lg border border-background-secondary-border bg-card p-8">
      <div className="flex items-center justify-end w-full">
        <Text color="secondary">
          <span className="colored-text">{count} unlocked</span> of {maxCount}
        </Text>
      </div>
      <div className="flex flex-wrap gap-4 ">{children}</div>
    </div>
  );
}
