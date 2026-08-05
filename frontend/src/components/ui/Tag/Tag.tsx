import type { ReactNode } from "react";
import styles from "./tag.module.css";

type Variant = "neutral" | "success" | "error" | "warning";

type TagProps = {
  children: ReactNode;
  variant?: Variant;
};

const DEFAULT_VARIANT: Variant = "neutral";

export default function Tag({ children, variant = DEFAULT_VARIANT }: TagProps) {
  const className = [styles.tag, styles["tag--" + variant]].join(" ");

  return <span className={className}>{children}</span>;
}
