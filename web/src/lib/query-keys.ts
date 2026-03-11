export const queryKeys = {
  company: () => ["company"] as const,
  projects: () => ["projects"] as const,
  project: (id: number) => ["projects", id] as const,
  expenses: (projectId: number) => ["projects", projectId, "expenses"] as const,
  processItems: (projectId: number) => ["projects", projectId, "processItems"] as const,
};
