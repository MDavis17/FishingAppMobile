import { authenticatedFetch, unauthenticatedFetch } from "common/api/request";
import { RequestMethod } from "common/api/types";

export type AuthUser = {
  id: number;
  email: string;
  created_at: string;
};

export async function registerUser(email: string, password: string) {
  return unauthenticatedFetch("auth/register", {
    method: RequestMethod.POST,
    body: JSON.stringify({ email, password }),
  });
}

export async function loginUser(email: string, password: string) {
  return unauthenticatedFetch("auth/login", {
    method: RequestMethod.POST,
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(token: string) {
  return authenticatedFetch(
    "auth/me",
    { method: RequestMethod.GET },
    token
  );
}
