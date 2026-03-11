import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCompany, updateCompany, type CreateCompanyParams } from "@/api/company";
import { queryKeys } from "@/lib/query-keys";

export function useCompany() {
  return useQuery({
    queryKey: queryKeys.company(),
    queryFn: getCompany,
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: Partial<CreateCompanyParams>) => updateCompany(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.company() });
    },
  });
}
