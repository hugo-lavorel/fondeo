import { api } from "./client";

export type Company = {
  id: number;
  name: string;
  siren: string;
  activity_description: string | null;
  sector: string;
  employee_range: string;
  annual_revenue_range: string;
  has_rd_team: boolean;
};

export type CreateCompanyParams = {
  name: string;
  siren: string;
  activity_description?: string;
  sector: string;
  employee_range: string;
  annual_revenue_range: string;
  has_rd_team: boolean;
};

export function createCompany(params: CreateCompanyParams) {
  return api<Company>("/api/v1/company", {
    method: "POST",
    body: { company: params },
  });
}

export function getCompany() {
  return api<Company>("/api/v1/company");
}

export function updateCompany(params: Partial<CreateCompanyParams>) {
  return api<Company>("/api/v1/company", {
    method: "PATCH",
    body: { company: params },
  });
}
