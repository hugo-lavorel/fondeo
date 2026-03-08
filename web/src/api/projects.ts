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
  process_before: string | null;
  process_after: string | null;
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
  total_expenses: number;
  total_eligible_expenses: number;
  total_leasing_expenses: number;
  created_at: string;
};

export type CreateProjectParams = {
  name: string;
  objective?: string;
  process_before?: string;
  process_after?: string;
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
    id?: number;
    permit_submission_date?: string;
    is_extension?: boolean;
    area_sqm?: number;
    usage_description?: string;
    works_start_date?: string;
    works_duration_months?: number;
    _destroy?: boolean;
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

// Expenses

export type FinancingType = "self_funded" | "loan" | "leasing";
export type InvestmentType = "building" | "equipment" | "software" | "consulting" | "training" | "r_and_d";

export type Expense = {
  id: number;
  name: string;
  amount: number;
  investment_type: InvestmentType;
  financing_type: FinancingType;
  loan_rate: number | null;
  loan_first_payment_date: string | null;
  quotes_count: number | null;
  quote_signed_date: string | null;
  works_start_date: string | null;
  works_end_date: string | null;
  commissioning_date: string | null;
  created_at: string;
};

export type CreateExpenseParams = {
  name: string;
  amount: number;
  investment_type: InvestmentType;
  financing_type: FinancingType;
  loan_rate?: number;
  loan_first_payment_date?: string;
  quotes_count?: number;
  quote_signed_date?: string;
  works_start_date?: string;
  works_end_date?: string;
  commissioning_date?: string;
};

export function getExpenses(projectId: number) {
  return api<Expense[]>(`/api/v1/projects/${projectId}/expenses`);
}

export function createExpense(projectId: number, params: CreateExpenseParams) {
  return api<Expense>(`/api/v1/projects/${projectId}/expenses`, {
    method: "POST",
    body: { expense: params },
  });
}

export function updateExpense(projectId: number, expenseId: number, params: Partial<CreateExpenseParams>) {
  return api<Expense>(`/api/v1/projects/${projectId}/expenses/${expenseId}`, {
    method: "PATCH",
    body: { expense: params },
  });
}

export function deleteExpense(projectId: number, expenseId: number) {
  return api<void>(`/api/v1/projects/${projectId}/expenses/${expenseId}`, {
    method: "DELETE",
  });
}

// Process Items (inputs/outputs)

export type ProcessItemDirection = "input" | "output";

export type ProcessItem = {
  id: number;
  direction: ProcessItemDirection;
  name: string;
  customs_code: string | null;
  percentage: number | null;
  certifications: string[];
  created_at: string;
};

export type CreateProcessItemParams = {
  direction: ProcessItemDirection;
  name: string;
  customs_code?: string;
  percentage?: number;
  certifications?: string[];
};

export function getProcessItems(projectId: number) {
  return api<ProcessItem[]>(`/api/v1/projects/${projectId}/process_items`);
}

export function createProcessItem(projectId: number, params: CreateProcessItemParams) {
  return api<ProcessItem>(`/api/v1/projects/${projectId}/process_items`, {
    method: "POST",
    body: { process_item: params },
  });
}

export function updateProcessItem(projectId: number, itemId: number, params: Partial<CreateProcessItemParams>) {
  return api<ProcessItem>(`/api/v1/projects/${projectId}/process_items/${itemId}`, {
    method: "PATCH",
    body: { process_item: params },
  });
}

export function deleteProcessItem(projectId: number, itemId: number) {
  return api<void>(`/api/v1/projects/${projectId}/process_items/${itemId}`, {
    method: "DELETE",
  });
}
