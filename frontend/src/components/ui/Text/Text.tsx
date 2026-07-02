import type { ReactNode } from "react";
import type { Size } from "../types";
import styles from "./text.module.css";

type Weight = "normal" | "medium" | "bold";
type Color = "primary" | "secondary" | "brand";

type TextProps = {
  children: ReactNode;
  size?: Size;
  weight?: Weight;
  color?: Color;
};

const DEFAULT_SIZE: Size = "normal";
const DEFAULT_WEIGHT: Weight = "normal";
const DEFAULT_COLOR: Color = "primary";

export default function Text({
  children,
  size = DEFAULT_SIZE,
  weight = DEFAULT_WEIGHT,
  color = DEFAULT_COLOR,
}: TextProps) {
  const className = [
    styles.text,
    styles["size--" + size],
    styles["weight--" + weight],
    styles["color--" + color],
  ].join(" ");

  return <p className={className}>{children}</p>;
}
