import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcessItems,
  createProcessItem,
  updateProcessItem,
  deleteProcessItem,
  type CreateProcessItemParams,
} from "@/api/projects";
import { queryKeys } from "@/lib/query-keys";

export function useProcessItems(projectId: number) {
  return useQuery({
    queryKey: queryKeys.processItems(projectId),
    queryFn: () => getProcessItems(projectId),
  });
}

export function useCreateProcessItem(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateProcessItemParams) => createProcessItem(projectId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processItems(projectId) });
    },
  });
}

export function useUpdateProcessItem(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, params }: { itemId: number; params: Partial<CreateProcessItemParams> }) =>
      updateProcessItem(projectId, itemId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processItems(projectId) });
    },
  });
}

export function useDeleteProcessItem(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: number) => deleteProcessItem(projectId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.processItems(projectId) });
    },
  });
}
