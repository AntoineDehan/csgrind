import type { ReactNode } from "react";
import Title, { type Level } from "../Title/Title";
import Text from "../Text/Text";

type SectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  id?: string;
  className?: string;
  children?: ReactNode;
  level?: Level;
};

const DEFAULT_LEVEL: Level = "h2";

export default function Section({
  title,
  subtitle,
  id,
  className,
  children,
  level = DEFAULT_LEVEL,
}: SectionProps) {
  return (
    <section id={id} className={className}>
      <div className="mb-3">
        {title && <Title level={level}>{title}</Title>}
        {subtitle && <Text>{subtitle}</Text>}
      </div>
      {children}
    </section>
  );
}
