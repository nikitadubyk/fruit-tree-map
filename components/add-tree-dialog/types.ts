import { Coordinate } from '@/types';

export interface AddTreeDialogProps {
  open: boolean;
  marker?: Coordinate;
  onOpenChange: (open: boolean) => void;
}
