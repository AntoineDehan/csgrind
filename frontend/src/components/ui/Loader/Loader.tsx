import type { Size } from "../types";
import styles from "./loader.module.css";

type LoaderProps = {
  size?: Size;
};

const DEFAULT_SIZE: Size = "normal";

export default function Loader({ size = DEFAULT_SIZE }: LoaderProps) {
  const className = [styles.loader, styles["loader--" + size]].join(" ");

  return <span className={className} />;
}
