import type { ReactNode } from "react";
import styles from "./title.module.css";

export type Level = "h1" | "h2" | "h3";

type TitleProps = {
  children: ReactNode;
  level?: Level;
};

const DEFAULT_LEVEL: Level = "h1";

export default function Title({ children, level = DEFAULT_LEVEL }: TitleProps) {
  const Heading = level;
  const className = [styles.title, styles["title--" + level]].join(" ");

  return <Heading className={className}>{children}</Heading>;
}
