import type { ReactNode } from "react";
import styles from "./alert.module.css";

type Variant = "info" | "success" | "error" | "warning";

type AlertProps = {
  children: ReactNode;
  variant?: Variant;
};

const DEFAULT_VARIANT: Variant = "info";

export default function Alert({
  children,
  variant = DEFAULT_VARIANT,
}: AlertProps) {
  const className = [styles.alert, styles["alert--" + variant]].join(" ");

  return <div className={className}>{children}</div>;
}
