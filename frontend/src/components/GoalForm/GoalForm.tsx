import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { createGoalSchema } from "@backend/schemas/goal.schema";
import { createGoal } from "../../services/goals";
import Button from "../ui/Button/Button";
import Text from "../ui/Text/Text";

const FREQUENCIES = ["DAYS_2", "DAYS_5", "DAYS_7", "DAYS_14", "DAYS_30"] as const;

const ELO_CONFIG = {
  FACEIT: { max: 3000, default: 2000 },
  PREMIER: { max: 30000, default: 15000 },
} as const;

const goalFormSchema = createGoalSchema
  .pick({ matchmaking: true, eloGoal: true, reportFrequency: true })
  .extend({ endDate: z.string().optional() });
type GoalFormValues = z.infer<typeof goalFormSchema>;

const fieldClass =
  "rounded-md border border-background-secondary-border bg-background-secondary px-3 py-2 text-text-primary";

type GoalFormProps = {
  onSuccess?: () => void;
};

export default function GoalForm({ onSuccess }: GoalFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal-stats"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      onSuccess?.();
    },
  });

  const form = useForm({
    defaultValues: {
      matchmaking: "PREMIER",
      eloGoal: 15000,
      reportFrequency: "DAYS_7",
      endDate: "",
    } as GoalFormValues,
    validators: { onChange: goalFormSchema },
    onSubmit: async ({ value }) => {
      const { endDate, ...rest } = value;
      await mutation.mutateAsync({
        ...rest,
        ...(endDate ? { endDate: new Date(endDate) } : {}),
      });
    },
  });

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
    >
      <form.Field name="matchmaking">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Text size="small" color="secondary">
              Matchmaking
            </Text>
            <select
              className={fieldClass}
              value={field.state.value}
              onChange={(e) => {
                const value = e.target.value as "FACEIT" | "PREMIER";
                field.handleChange(value);
                form.setFieldValue("eloGoal", ELO_CONFIG[value].default);
              }}
            >
              <option value="FACEIT">FACEIT</option>
              <option value="PREMIER">PREMIER</option>
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="eloGoal">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Text size="small" color="secondary">
              Elo target
            </Text>
            <form.Subscribe selector={(state) => state.values.matchmaking}>
              {(matchmaking) => (
                <input
                  className={fieldClass}
                  type="number"
                  max={ELO_CONFIG[matchmaking].max}
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      Math.min(
                        Number(e.target.value),
                        ELO_CONFIG[matchmaking].max,
                      ),
                    )
                  }
                />
              )}
            </form.Subscribe>
          </div>
        )}
      </form.Field>

      <form.Field name="reportFrequency">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Text size="small" color="secondary">
              Report frequency
            </Text>
            <select
              className={fieldClass}
              value={field.state.value}
              onChange={(e) =>
                field.handleChange(e.target.value as (typeof FREQUENCIES)[number])
              }
            >
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>
                  Every {f.replace("DAYS_", "")} days
                </option>
              ))}
            </select>
          </div>
        )}
      </form.Field>

      <form.Field name="endDate">
        {(field) => (
          <div className="flex flex-col gap-1">
            <Text size="small" color="secondary">
              End date (optional)
            </Text>
            <input
              className={fieldClass}
              type="date"
              value={field.state.value ?? ""}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      </form.Field>

      <Button type="submit" variant="cta" disabled={mutation.isPending}>
        Create goal
      </Button>
      {mutation.error && (
        <Text size="small" className="text-destructive">
          {mutation.error.message}
        </Text>
      )}
    </form>
  );
}
