import { api } from "./client";

export type ProjectPermit = {
  id: number;
  permit_submission_date: string;
  is_extension: boolean;
  area_sqm: number;
  usage_description: string;
  works_start_date: string;
  works_duration_months: number;
};

export type Project = {
  id: number;
  name: string;
  objective: string | null;
  location_is_headquarters: boolean;
  location_street: string | null;
  location_postal_code: string | null;
  location_city: string | null;
  location_department: string | null;
  location_region: string | null;
  contact_first_name: string | null;
  contact_last_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_role: string | null;
  needs_building_permit: boolean;
  permit: ProjectPermit | null;
  created_at: string;
};

export type CreateProjectParams = {
  name: string;
  objective?: string;
  location_is_headquarters?: boolean;
  location_street?: string;
  location_postal_code?: string;
  location_city?: string;
  location_department?: string;
  location_region?: string;
  contact_first_name?: string;
  contact_last_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_role?: string;
  needs_building_permit?: boolean;
  permit_attributes?: {
    permit_submission_date?: string;
    is_extension?: boolean;
    area_sqm?: number;
    usage_description?: string;
    works_start_date?: string;
    works_duration_months?: number;
  };
};

export function getProjects() {
  return api<Project[]>("/api/v1/projects");
}

export function getProject(id: number) {
  return api<Project>(`/api/v1/projects/${id}`);
}

export function createProject(params: CreateProjectParams) {
  return api<Project>("/api/v1/projects", {
    method: "POST",
    body: { project: params },
  });
}

export function updateProject(id: number, params: Partial<CreateProjectParams>) {
  return api<Project>(`/api/v1/projects/${id}`, {
    method: "PATCH",
    body: { project: params },
  });
}

export function deleteProject(id: number) {
  return api<void>(`/api/v1/projects/${id}`, { method: "DELETE" });
}
