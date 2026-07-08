import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { createGoalSchema } from "@backend/schemas/goal.schema";
import { createGoal } from "../services/goals";

const FREQUENCIES = [
  "DAYS_2",
  "DAYS_5",
  "DAYS_7",
  "DAYS_14",
  "DAYS_30",
] as const;

const goalFormSchema = createGoalSchema
  .pick({
    matchmaking: true,
    eloGoal: true,
    reportFrequency: true,
  })
  .extend({ endDate: z.string().optional() });
type GoalFormValues = z.infer<typeof goalFormSchema>;

export default function SetGoal() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["goal-stats"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      navigate("/dashboard");
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
    <div>
      <h1>Create a goal</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="matchmaking">
          {(field) => (
            <div>
              <label>Matchmaking </label>
              <select
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(e.target.value as "FACEIT" | "PREMIER")
                }
              >
                <option value="FACEIT">FACEIT</option>
                <option value="PREMIER">PREMIER</option>
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="eloGoal">
          {(field) => (
            <div>
              <label>Elo target </label>
              <input
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="reportFrequency">
          {(field) => (
            <div>
              <label>Report frequency </label>
              <select
                value={field.state.value}
                onChange={(e) =>
                  field.handleChange(
                    e.target.value as (typeof FREQUENCIES)[number],
                  )
                }
              >
                {FREQUENCIES.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
          )}
        </form.Field>

        <form.Field name="endDate">
          {(field) => (
            <div>
              <label>End date (optional) </label>
              <input
                type="date"
                value={field.state.value ?? ""}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        </form.Field>

        <button type="submit" disabled={mutation.isPending}>
          Create goal
        </button>
        {mutation.error && <p>{mutation.error.message}</p>}
      </form>
    </div>
  );
}
