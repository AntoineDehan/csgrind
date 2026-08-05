import Text from "../Text/Text";
import Loader from "../Loader/Loader";
import Checkbox from "../Checkbox/Checkbox";
import { useGoalTasks } from "../../../hooks/useGoals";
import { useToggleReportTask } from "../../../hooks/useTasks";

type TaskListProps = {
  goalId: string;
};

export default function TaskList({ goalId }: TaskListProps) {
  const { data, isLoading } = useGoalTasks(goalId);
  const toggle = useToggleReportTask();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-background-secondary-border bg-card p-8">
        <Loader />
      </div>
    );
  }

  if (!data) return null;

  const isEmpty = data.challenges.length === 0 && data.manual.length === 0;

  return (
    <div className="rounded-lg border border-background-secondary-border bg-card">
      {isEmpty ? (
        <div className="px-6 py-4">
          <Text color="secondary">No tasks yet.</Text>
        </div>
      ) : (
        <ul className="divide-y divide-background-secondary-border ">
          {data.challenges.map((challenge) => {
            const done = challenge.currentPct >= challenge.targetPct;
            const fill =
              challenge.targetPct > 0
                ? Math.min(
                    100,
                    (challenge.currentPct / challenge.targetPct) * 100,
                  )
                : 0;
            return (
              <li
                key={challenge.taskId}
                className="flex items-center gap-4 px-6 py-4"
              >
                <Checkbox checked={done} disabled />
                <div className="flex-1">
                  <Text>{challenge.content}</Text>
                  <div className="mt-2 h-0.5 w-full rounded-full bg-background-secondary-border">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${fill}%` }}
                    />
                  </div>
                </div>
                <Text mono weight="bold" color="brand">
                  {challenge.currentPct} / {challenge.targetPct}%
                </Text>
              </li>
            );
          })}

          {data.manual.map((task) => (
            <li key={task.taskId} className="flex items-center gap-4 px-6 py-4">
              <Checkbox
                checked={task.isCompleted}
                disabled={toggle.isPending}
                onChange={(next) =>
                  toggle.mutate({
                    reportId: task.reportId,
                    taskId: task.taskId,
                    isCompleted: next,
                  })
                }
              />
              <Text
                span
                color={task.isCompleted ? "secondary" : "primary"}
                className="flex-1"
              >
                {task.content}
              </Text>
              <Text size="small" color="secondary">
                task
              </Text>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
