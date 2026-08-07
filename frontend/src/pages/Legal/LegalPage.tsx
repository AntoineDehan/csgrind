import type { ReactNode } from "react";
import Title from "../../components/ui/Title/Title";
import Text from "../../components/ui/Text/Text";

type LegalPageProps = {
  title: string;
  updatedAt: string;
  children: ReactNode;
};

export default function LegalPage({
  title,
  updatedAt,
  children,
}: LegalPageProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 max-md:py-10">
      <Title>{title}</Title>
      <div className="mt-2">
        <Text size="small" color="secondary">
          Last updated {updatedAt}
        </Text>
      </div>
      <div className="mt-10 flex flex-col gap-8">{children}</div>
    </div>
  );
}

type LegalSectionProps = {
  heading: string;
  children: ReactNode;
};

export function LegalSection({ heading, children }: LegalSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <Title level="h2">{heading}</Title>
      {children}
    </section>
  );
}
