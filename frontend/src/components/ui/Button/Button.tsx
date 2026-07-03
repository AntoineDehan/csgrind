import type { ReactNode, MouseEventHandler } from "react";
import styles from "./button.module.css";

type Variant = "normal" | "cta";

type ButtonProps = {
  children?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: Variant;
  icon?: ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
};

const DEFAULT_VARIANT: Variant = "normal";
const DEFAULT_TYPE = "button";

export default function Button({
  children,
  onClick,
  variant = DEFAULT_VARIANT,
  icon,
  type = DEFAULT_TYPE,
  disabled = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const className = [styles.button, styles["button--" + variant]].join(" ");

  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </button>
  );
}
