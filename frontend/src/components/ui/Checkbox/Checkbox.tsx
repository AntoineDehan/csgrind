import { Check } from "lucide-react";

type CheckboxProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const DEFAULT_DISABLED = false;

export default function Checkbox({
  checked,
  onChange,
  disabled = DEFAULT_DISABLED,
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`flex size-5 shrink-0 items-center justify-center rounded border transition-colors ${
        checked
          ? "border-brand bg-brand text-background"
          : "border-background-secondary-border bg-background-secondary"
      } ${disabled ? "cursor-default opacity-60" : "cursor-pointer"}`}
    >
      {checked && <Check className="size-3.5" strokeWidth={3} />}
    </button>
  );
}
