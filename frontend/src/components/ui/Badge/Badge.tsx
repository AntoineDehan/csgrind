import Text from "../Text/Text";

type BadgeProps = {
  icon: string;
  name: string;
  description?: string;
  new?: boolean;
  compact?: boolean;
};

const DEFAULT_NEW = false;
const DEFAULT_COMPACT = false;

export default function Badge({
  icon,
  name,
  description,
  new: isNew = DEFAULT_NEW,
  compact = DEFAULT_COMPACT,
}: BadgeProps) {
  const glow = isNew ? "shadow-[0_0_16px_rgba(83,202,101,0.35)]" : "";
  const box = compact
    ? "size-12 rounded-xl text-2xl"
    : "size-16 rounded-2xl text-3xl";

  return (
    <div
      className="flex w-26 flex-col items-center gap-2 text-center"
      title={description}
    >
      <div
        className={`flex items-center justify-center border border-brand/60 leading-none ${box} ${glow}`}
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(83,202,101,0.25), var(--color-background-secondary))",
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <Text size="xsmall">{name}</Text>
      </div>
    </div>
  );
}
