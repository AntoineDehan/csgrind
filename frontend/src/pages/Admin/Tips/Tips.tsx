import { useState, type SyntheticEvent } from "react";
import Container from "../../../components/ui/Container/Container";
import Title from "../../../components/ui/Title/Title";
import Text from "../../../components/ui/Text/Text";
import Input from "../../../components/ui/Input/Input";
import Select from "../../../components/ui/Select/Select";
import Button from "../../../components/ui/Button/Button";
import Alert from "../../../components/ui/Alert/Alert";
import Loader from "../../../components/ui/Loader/Loader";
import { useTips, useCreateTip, useDeleteTip } from "../../../hooks/useTips";
import { STAT_OPTIONS } from "../../../lib/statOptions";

export default function Tips() {
  const { data: tips, isLoading } = useTips();
  const createTip = useCreateTip();
  const deleteTip = useDeleteTip();

  const [category, setCategory] = useState("accuracyHead");
  const [priority, setPriority] = useState("1");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError("Content is required.");
      return;
    }

    createTip.mutate(
      { category, priority: Number(priority), content: content.trim() },
      {
        onSuccess: () => setContent(""),
        onError: (err) =>
          setError(
            err instanceof Error ? err.message : "Failed to create tip.",
          ),
      },
    );
  }

  return (
    <Container>
      <div className="py-10">
        <Title>Manage tips</Title>

        <form
          onSubmit={handleSubmit}
          className="mt-6 flex max-w-xl flex-col gap-4"
        >
          <label className="flex flex-col gap-1">
            <Text span size="small" color="secondary">
              Category
            </Text>
            <Select
              options={STAT_OPTIONS}
              value={category}
              onChange={setCategory}
              aria-label="Category"
            />
          </label>

          <label className="flex flex-col gap-1">
            <Text span size="small" color="secondary">
              Priority
            </Text>
            <Input
              type="number"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              aria-label="Priority"
            />
          </label>

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

          {error && <Alert variant="error">{error}</Alert>}

          <div>
            <Button type="submit" disabled={createTip.isPending}>
              {createTip.isPending ? "Adding…" : "Add tip"}
            </Button>
          </div>
        </form>

        <div className="mt-10">
          <Title level="h2">Existing tips</Title>

          {isLoading ? (
            <div className="py-6">
              <Loader />
            </div>
          ) : tips && tips.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-3">
              {tips.map((tip) => (
                <li
                  key={tip.id}
                  className="rounded-md border border-background-secondary-border bg-background-secondary p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Text span size="small" color="secondary">
                      {tip.category}
                    </Text>
                    <div className="flex items-center gap-3">
                      <Text span size="small" color="secondary">
                        priority {tip.priority}
                      </Text>
                      <button
                        type="button"
                        onClick={() => deleteTip.mutate(tip.id)}
                        disabled={deleteTip.isPending}
                        aria-label="Delete tip"
                        className="leading-none text-text-secondary transition-colors hover:text-destructive"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <Text>{tip.content}</Text>
                </li>
              ))}
            </ul>
          ) : (
            <Text color="secondary">No tips yet.</Text>
          )}
        </div>
      </div>
    </Container>
  );
}
