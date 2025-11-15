import { Tree } from '@/app/generated/prisma';

export interface UpdateStatusButtonsProps {
  tree: Tree;
  isMinify?: boolean;
  onSuccess?: () => void;
}
