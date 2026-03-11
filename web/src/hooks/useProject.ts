import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, updateProject, type CreateProjectParams } from "@/api/projects";
import { queryKeys } from "@/lib/query-keys";

export function useProject(id: number) {
  return useQuery({
    queryKey: queryKeys.project(id),
    queryFn: () => getProject(id),
  });
}

export function useUpdateProject(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Partial<CreateProjectParams>) => updateProject(id, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.project(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}
