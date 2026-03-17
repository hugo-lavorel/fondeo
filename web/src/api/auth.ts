import { api } from "./client";

export type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  has_company: boolean;
};

type SignupParams = {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  invite_token: string;
};

type LoginParams = {
  email: string;
  password: string;
};

export function signup(params: SignupParams) {
  const { invite_token, ...user } = params;
  return api<User>("/api/v1/signup", {
    method: "POST",
    body: { user, invite_token },
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
