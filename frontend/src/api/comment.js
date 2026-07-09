import { apiFetch } from "./api";

export function createComment(data) {
  return apiFetch("/comment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}
