import { apiFetch } from "./api";

export function login(data) {
  return apiFetch("/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function signup(data) {
  return apiFetch("/user/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function logout() {
  return apiFetch("/user/logout");
}

export function getCurrentUser() {
  return apiFetch("/user/me");
}
