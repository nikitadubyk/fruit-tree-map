export interface ConfirmDeleteDialogProps {
  open: boolean;
  loading: boolean;
  treeName: string;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
}
