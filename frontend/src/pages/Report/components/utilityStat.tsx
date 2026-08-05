import type { categoryStatProps } from "../types";
import StatCompareContainer from "@/components/ui/StatCompareContainer/StatCompareContainer";
import Section from "@/components/ui/Section/Section";

export default function utilityStat({
  children,
  className,
}: categoryStatProps) {
  return (
    <Section title="UTILITY" className={className} level="h3">
      <div className="mt-4">
        <StatCompareContainer>{children}</StatCompareContainer>
      </div>
    </Section>
  );
}
