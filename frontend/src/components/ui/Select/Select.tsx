import styles from "./select.module.css";

type Option = {
  value: string;
  label: string;
};

type SelectProps = {
  options: Option[];
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  "aria-label"?: string;
};

export default function Select({
  options,
  value,
  onChange,
  name,
  id,
  disabled,
  "aria-label": ariaLabel,
}: SelectProps) {
  return (
    <select
      className={styles.select}
      value={value}
      name={name}
      id={id}
      disabled={disabled}
      aria-label={ariaLabel}
      onChange={(event) => onChange?.(event.target.value)}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
