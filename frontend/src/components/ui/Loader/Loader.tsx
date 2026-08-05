import type { Size } from "../types";
import styles from "./loader.module.css";

type LoaderProps = {
  size?: Size;
  label?: string;
};

const DEFAULT_SIZE: Size = "normal";
const DEFAULT_LABEL = "Loading";

export default function Loader({
  size = DEFAULT_SIZE,
  label = DEFAULT_LABEL,
}: LoaderProps) {
  const className = [styles.loader, styles["loader--" + size]].join(" ");

  return <span className={className} role="status" aria-label={label} />;
}
