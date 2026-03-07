import { api } from "./client";

export type Project = {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
};

export function getProjects() {
  return api<Project[]>("/api/v1/projects");
}

export function getProject(id: number) {
  return api<Project>(`/api/v1/projects/${id}`);
}

export function createProject(params: { name: string; description?: string }) {
  return api<Project>("/api/v1/projects", {
    method: "POST",
    body: { project: params },
  });
}

export function updateProject(id: number, params: { name?: string; description?: string }) {
  return api<Project>(`/api/v1/projects/${id}`, {
    method: "PATCH",
    body: { project: params },
  });
}

export function deleteProject(id: number) {
  return api<void>(`/api/v1/projects/${id}`, { method: "DELETE" });
}
