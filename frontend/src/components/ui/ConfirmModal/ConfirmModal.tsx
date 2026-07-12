import Modal from "../Modal/Modal";
import Button from "../Button/Button";
import Text from "../Text/Text";

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

const DEFAULT_CONFIRM = "Confirm";
const DEFAULT_CANCEL = "Cancel";

export default function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = DEFAULT_CONFIRM,
  cancelLabel = DEFAULT_CANCEL,
}: ConfirmModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <Text color="secondary">{message}</Text>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button variant="cta" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
