import { useState, type SyntheticEvent } from "react";
import Container from "../../../components/ui/Container/Container";
import Title from "../../../components/ui/Title/Title";
import Text from "../../../components/ui/Text/Text";
import Input from "../../../components/ui/Input/Input";
import Select from "../../../components/ui/Select/Select";
import Button from "../../../components/ui/Button/Button";
import Alert from "../../../components/ui/Alert/Alert";
import Loader from "../../../components/ui/Loader/Loader";
import {
  useTasks,
  useCreateTask,
  useDeleteTask,
} from "../../../hooks/useTasks";
import { STAT_OPTIONS } from "../../../lib/statOptions";

export default function Tasks() {
  const { data: tasks, isLoading } = useTasks();
  const createTask = useCreateTask();
  const deleteTask = useDeleteTask();

  const [content, setContent] = useState("");
  const [isTrackable, setIsTrackable] = useState(false);
  const [taskStat, setTaskStat] = useState("aimRating");
  const [trackMap, setTrackMap] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    createTask.mutate(
      {
        content: content.trim(),
        isTrackable,
        ...(isTrackable ? { taskStat } : {}),
        ...(isTrackable && trackMap.trim() ? { trackMap: trackMap.trim() } : {}),
      },
      {
        onSuccess: () => {
          setContent("");
          setTrackMap("");
        },
        onError: (err) =>
          setError(
            err instanceof Error ? err.message : "Failed to create task.",
          ),
      },
    );
  }

  return (
    <Container>
      <div className="py-10">
        <Title>Manage tasks</Title>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex max-w-xl flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <Text span size="small" color="secondary">
              Content
            </Text>
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows={3}
              className="rounded-md border border-background-secondary-border bg-background-secondary p-3 text-text-primary"
              aria-label="Content"
            />
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isTrackable}
              onChange={(event) => setIsTrackable(event.target.checked)}
              aria-label="Trackable challenge"
            />
            <Text span size="small" color="secondary">
              Trackable challenge
            </Text>
          </label>

          {isTrackable && (
            <>
              <label className="flex flex-col gap-1">
                <Text span size="small" color="secondary">
                  Tracked stat
                </Text>
                <Select
                  options={STAT_OPTIONS}
                  value={taskStat}
                  onChange={setTaskStat}
                  aria-label="Tracked stat"
                />
              </label>

              <label className="flex flex-col gap-1">
                <Text span size="small" color="secondary">
                  Map (optional)
                </Text>
                <Input
                  value={trackMap}
                  onChange={(event) => setTrackMap(event.target.value)}
                  aria-label="Map"
                />
              </label>
            </>
          )}

          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending ? "Adding…" : "Add task"}
            </Button>
          </div>
        </form>

        <div className="mt-10">
          <Title level="h2">Existing tasks</Title>

          {isLoading ? (
            <div className="py-6">
              <Loader />
            </div>
          ) : tasks && tasks.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-md border border-background-secondary-border bg-background-secondary p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Text span size="small" color="secondary">
                      {task.isTrackable
                        ? `challenge · ${task.taskStat ?? "—"}`
                        : "manual"}
                    </Text>
                    <button
                      type="button"
                      onClick={() => deleteTask.mutate(task.id)}
                      disabled={deleteTask.isPending}
                      aria-label="Delete task"
                      className="leading-none text-text-secondary transition-colors hover:text-destructive"
                    >
                      ✕
                    </button>
                  </div>
                  <Text>{task.content}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text color="secondary">No tasks yet.</Text>
          )}
        </div>
      </div>
    </Container>
  );
}
