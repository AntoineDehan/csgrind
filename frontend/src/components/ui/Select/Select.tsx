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
  disabled?: boolean;
};

export default function Select({
  options,
  value,
  onChange,
  name,
  disabled,
}: SelectProps) {
  return (
    <select
      className={styles.select}
      value={value}
      name={name}
      disabled={disabled}
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
