import { Children, type ReactNode } from "react";

type StatCompareContainerProps = {
  children: ReactNode;
};

export default function StatCompareContainer({
  children,
}: StatCompareContainerProps) {
  return (
    <div className="flex divide-x divide-background-secondary-border overflow-x-auto rounded-md border border-background-secondary-border max-md:grid max-md:grid-cols-2 max-md:divide-x-0 max-md:gap-px max-md:bg-background-secondary-border max-md:overflow-hidden">
      {Children.map(children, (child) => (
        <div className="flex-1 max-md:only:col-span-2">{child}</div>
      ))}
    </div>
  );
}
