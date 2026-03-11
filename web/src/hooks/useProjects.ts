import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, deleteProject, type CreateProjectParams } from "@/api/projects";
import { queryKeys } from "@/lib/query-keys";

export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects(),
    queryFn: getProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateProjectParams) => createProject(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects() });
    },
  });
}
