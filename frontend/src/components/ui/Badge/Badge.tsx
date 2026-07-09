import Text from "../Text/Text";

type BadgeProps = {
  icon: string;
  name: string;
  description?: string;
  new?: boolean;
};

const DEFAULT_NEW = false;

export default function Badge({
  icon,
  name,
  description,
  new: isNew = DEFAULT_NEW,
}: BadgeProps) {
  const glow = isNew ? "shadow-[0_0_16px_rgba(83,202,101,0.35)]" : "";

  return (
    <div
      className="flex w-26 flex-col items-center gap-2 text-center"
      title={description}
    >
      <div
        className={`flex size-16 items-center justify-center rounded-2xl border border-brand/60 text-3xl leading-none ${glow}`}
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(83,202,101,0.25), var(--color-background-secondary))",
        }}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <Text span size="small">
          {name}
        </Text>
      </div>
    </div>
  );
}
