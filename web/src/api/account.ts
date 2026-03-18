import { api } from "./client";
import type { User } from "./auth";

export function updateAccount(params: {
  first_name: string;
  last_name: string;
  email: string;
  current_password: string;
}) {
  return api<User>("/api/v1/account", {
    method: "PATCH",
    body: { account: params },
  });
}

export function updatePassword(params: {
  current_password: string;
  password: string;
  password_confirmation: string;
}) {
  return api<User>("/api/v1/account/password", {
    method: "PATCH",
    body: { account: params },
  });
}

export function deleteAccount(params: { current_password: string }) {
  return api<void>("/api/v1/account", {
    method: "DELETE",
    body: { account: params },
  });
}
