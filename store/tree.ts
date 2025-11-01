import { create } from 'zustand';

import { api } from '@/api';
import { URL } from '@/config';
import { Tree } from '@/app/generated/prisma';

interface TreeState {
  trees: Tree[];
  addTree: (tree: Tree) => void;
  getTrees: () => Promise<Tree[]>;
  updateTree: (tree: Tree) => void;
  setTrees: (trees: Tree[]) => void;
}

export const useTreeStore = create<TreeState>((set) => ({
  trees: [],
  setTrees: (trees) => set({ trees }),
  addTree: (tree) => set((state) => ({ trees: [...state.trees, tree] })),
  updateTree: (tree) =>
    set((state) => ({
      trees: state.trees.map((t) => (t.id === tree.id ? tree : t)),
    })),
  getTrees: async () => {
    const trees = await api.get<void, Tree[]>(URL.GET_TREES);
    set(() => ({ trees }));
    return trees;
  },
}));
