import { api } from '@/api';
import { URL } from '@/config';
import { addParamsToUrl } from '@/utils';
import { TreeWithCreator } from '@/types';
import { Tree } from '@/app/generated/prisma';

import { CreateTreeData, UpdateTreeStatusData } from './types';
export * from './types';

export const treesApi = {
  getTrees: async (
    status?: 'pending' | 'approved'
  ): Promise<TreeWithCreator[]> => {
    const response = await api.get<TreeWithCreator[]>(
      addParamsToUrl(URL.GET_TREES, { status })
    );
    return response.data;
  },

  createTree: async (treeData: CreateTreeData): Promise<Tree> => {
    const { data } = await api.post(URL.GET_TREES, treeData);
    return data;
  },

  deleteTree: async (treeId: number): Promise<{ message: string }> => {
    const { data } = await api.delete(
      URL.DELETE_TREE.replace(':id', String(treeId))
    );
    return data;
  },

  updateTreeStatus: async ({
    treeId,
    status,
  }: UpdateTreeStatusData): Promise<Tree> => {
    const { data } = await api.patch(URL.UPDATE_TREE_STATUS, {
      treeId,
      status,
    });
    return data;
  },
};
