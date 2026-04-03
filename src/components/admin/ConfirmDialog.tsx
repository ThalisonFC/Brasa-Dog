import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning';
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
  variant = 'warning',
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p className="mb-6 text-sm text-muted-foreground">{description}</p>
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" type="button" onClick={onCancel} className="px-4 py-2">
          Cancelar
        </Button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onCancel();
          }}
          className={`rounded-lg px-4 py-2 font-bold transition-all ${
            variant === 'danger'
              ? 'bg-destructive text-destructive-foreground hover:opacity-90'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`.trim()}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
