import { api } from "./client";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
};

type SignupParams = {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
};

type LoginParams = {
  email: string;
  password: string;
};

export function signup(params: SignupParams) {
  return api<User>("/api/v1/signup", {
    method: "POST",
    body: { user: params },
  });
}

export function login(params: LoginParams) {
  return api<User>("/api/v1/login", {
    method: "POST",
    body: { session: params },
  });
}

export function logout() {
  return api<void>("/api/v1/logout", { method: "DELETE" });
}

export function getCurrentUser() {
  return api<User>("/api/v1/me");
}
