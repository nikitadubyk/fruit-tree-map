import { create } from 'zustand';
import { Tree } from '@/app/generated/prisma';

interface TreeNavigationState {
  targetTree: Tree | null;
  setTargetTree: (tree: Tree | null) => void;
  clearTargetTree: () => void;
}

export const useTreeNavigationStore = create<TreeNavigationState>((set) => ({
  targetTree: null,
  setTargetTree: (tree) => set({ targetTree: tree }),
  clearTargetTree: () => set({ targetTree: null }),
}));
