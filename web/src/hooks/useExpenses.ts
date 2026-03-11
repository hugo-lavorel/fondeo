import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
  type CreateExpenseParams,
} from "@/api/projects";
import { queryKeys } from "@/lib/query-keys";

export function useExpenses(projectId: number) {
  return useQuery({
    queryKey: queryKeys.expenses(projectId),
    queryFn: () => getExpenses(projectId),
  });
}

export function useCreateExpense(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: CreateExpenseParams) => createExpense(projectId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useUpdateExpense(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ expenseId, params }: { expenseId: number; params: Partial<CreateExpenseParams> }) =>
      updateExpense(projectId, expenseId, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}

export function useDeleteExpense(projectId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (expenseId: number) => deleteExpense(projectId, expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses(projectId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.project(projectId) });
    },
  });
}
