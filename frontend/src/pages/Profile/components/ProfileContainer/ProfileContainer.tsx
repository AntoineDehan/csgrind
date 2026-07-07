import type { ReactNode } from "react";
import styles from "./profilecontainer.module.css";

type ProfileContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function ProfileContainer({
  children,
  className,
}: ProfileContainerProps) {
  return (
    <div className={[styles.container, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
