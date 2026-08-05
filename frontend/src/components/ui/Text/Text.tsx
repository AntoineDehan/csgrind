import type { ReactNode } from "react";
import type { Size, Color } from "../types";
import styles from "./text.module.css";

type Weight = "normal" | "medium" | "bold";

type TextProps = {
  children: ReactNode;
  size?: Size;
  weight?: Weight;
  color?: Color;
  span?: boolean;
  mono?: boolean;
  className?: string;
};

const DEFAULT_SIZE: Size = "normal";
const DEFAULT_WEIGHT: Weight = "normal";
const DEFAULT_COLOR: Color = "primary";
const DEFAULT_SPAN = false;
const DEFAULT_MONO = false;

export default function Text({
  children,
  size = DEFAULT_SIZE,
  weight = DEFAULT_WEIGHT,
  color = DEFAULT_COLOR,
  span = DEFAULT_SPAN,
  mono = DEFAULT_MONO,
  className,
}: TextProps) {
  const Tag = span ? "span" : "p";
  const classes = [
    styles.text,
    styles["size--" + size],
    styles["weight--" + weight],
    styles["color--" + color],
    mono && styles.mono,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <Tag className={classes}>{children}</Tag>;
}
