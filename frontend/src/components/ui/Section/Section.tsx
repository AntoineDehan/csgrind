import type { ReactNode } from "react";
import Title from "../Title/Title";
import Text from "../Text/Text";

type SectionProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  id?: string;
  className?: string;
  children?: ReactNode;
};

export default function Section({
  title,
  subtitle,
  id,
  className,
  children,
}: SectionProps) {
  return (
    <section id={id} className={className}>
      {title && <Title level="h2">{title}</Title>}
      {subtitle && <Text>{subtitle}</Text>}
      {children}
    </section>
  );
}
