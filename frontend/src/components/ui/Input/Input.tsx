import type { InputHTMLAttributes } from "react";
import styles from "./input.module.css";

type InputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  | "type"
  | "value"
  | "onChange"
  | "onBlur"
  | "placeholder"
  | "disabled"
  | "name"
  | "required"
  | "id"
>;

export default function Input(props: InputProps) {
  return <input className={styles.input} {...props} />;
}
