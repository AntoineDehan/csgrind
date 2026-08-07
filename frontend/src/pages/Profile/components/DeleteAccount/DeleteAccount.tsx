import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/ui/Button/Button";
import Text from "../../../../components/ui/Text/Text";
import Title from "../../../../components/ui/Title/Title";
import Alert from "../../../../components/ui/Alert/Alert";
import { useDeleteAccount } from "../../../../auth/useAuth";

type DeleteAccountProps = {
  userId: string;
};

export default function DeleteAccount({ userId }: DeleteAccountProps) {
  const [confirming, setConfirming] = useState(false);
  const navigate = useNavigate();
  const mutation = useDeleteAccount();

  async function handleDelete() {
    await mutation.mutateAsync(userId);
    navigate("/", { replace: true });
  }

  return (
    <section className="mt-12 rounded-xl border border-destructive/40 p-6">
      <Title level="h3">Delete my account</Title>

      <div className="mt-2 flex flex-col gap-2">
        <Text size="small" color="secondary">
          This erases your account, your goals, your reports and your badges.
          The deletion is immediate and permanent — nothing can be recovered.
        </Text>
      </div>

      {mutation.error && (
        <div className="mt-4">
          <Alert variant="error">{mutation.error.message}</Alert>
        </div>
      )}

      <div className="mt-4">
        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <Text size="small">Are you sure?</Text>
            <Button
              type="button"
              variant="cta"
              disabled={mutation.isPending}
              onClick={handleDelete}
            >
              {mutation.isPending ? "Deleting…" : "Yes, delete everything"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={mutation.isPending}
              onClick={() => setConfirming(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setConfirming(true)}
          >
            Delete my account
          </Button>
        )}
      </div>
    </section>
  );
}
