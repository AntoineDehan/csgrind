import type { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import styles from "./link.module.css";

type LinkProps = {
  to: string;
  children: ReactNode;
};

export default function Link({ to, children }: LinkProps) {
  return (
    <RouterLink to={to} className={styles.link}>
      {children}
    </RouterLink>
  );
}
