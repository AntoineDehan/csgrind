import type { categoryStatProps } from "../types";
import StatCompareContainer from "@/components/ui/StatCompareContainer/StatCompareContainer";
import Section from "@/components/ui/Section/Section";

export default function posStat({ children, className }: categoryStatProps) {
  return (
    <Section title="POSITIONING" className={className} level="h3">
      <div className="mt-4">
        <StatCompareContainer>{children}</StatCompareContainer>
      </div>
    </Section>
  );
}
