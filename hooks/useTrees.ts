import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Tree } from '@/app/generated/prisma';
import {
  treesApi,
  CreateTreeData,
  UpdateTreeStatusData,
} from '@/lib/api/trees';

export const TREES_QUERY_KEY = ['trees'] as const;

export const useTrees = () =>
  useQuery<Tree[]>({
    queryKey: TREES_QUERY_KEY,
    queryFn: treesApi.getTrees,
  });

export const useCreateTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTreeData) => treesApi.createTree(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TREES_QUERY_KEY });
    },
  });
};

export const useDeleteTree = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (treeId: number) => treesApi.deleteTree(treeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TREES_QUERY_KEY });
    },
  });
};

export const useUpdateTreeStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTreeStatusData) => treesApi.updateTreeStatus(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TREES_QUERY_KEY });
    },
  });
};
