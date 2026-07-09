import Title from "../Title/Title";
import Text from "../Text/Text";
import Loader from "../Loader/Loader";
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
    <div className="rounded-lg border border-background-secondary-border bg-card p-8">
      <Title level="h2">Tasks</Title>

      {isEmpty && <Text color="secondary">No tasks yet.</Text>}

      {data.challenges.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {data.challenges.map((challenge) => (
            <li key={challenge.taskId} className="flex items-baseline gap-2">
              <Text span weight="medium">
                {challenge.currentPct} / {challenge.targetPct}%
              </Text>
              <Text span color="secondary">
                {challenge.content}
              </Text>
            </li>
          ))}
        </ul>
      )}

      {data.manual.length > 0 && (
        <ul className="mt-6 flex flex-col gap-3">
          {data.manual.map((task) => (
            <li key={task.taskId}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={task.isCompleted}
                  disabled={toggle.isPending}
                  onChange={() =>
                    toggle.mutate({
                      reportId: task.reportId,
                      taskId: task.taskId,
                      isCompleted: !task.isCompleted,
                    })
                  }
                />
                <Text span color={task.isCompleted ? "secondary" : "primary"}>
                  {task.content}
                </Text>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
