import { Children, type ReactNode } from "react";

type StatCompareContainerProps = {
  children: ReactNode;
};

export default function StatCompareContainer({
  children,
}: StatCompareContainerProps) {
  return (
    <div className="flex divide-x divide-background-secondary-border overflow-x-auto rounded-md border border-background-secondary-border">
      {Children.map(children, (child) => (
        <div className="flex-1">{child}</div>
      ))}
    </div>
  );
}
