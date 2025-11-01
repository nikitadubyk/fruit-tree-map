import { ReactNode } from 'react';

import { Tree } from '@/app/generated/prisma';

export interface TreeDetailsDialogProps {
  open: boolean;
  tree: Tree | null;
  onOpenChange: (open: boolean) => void;
}

export interface InfoItem {
  title: string;
  value: string;
  icon: ReactNode;
}
