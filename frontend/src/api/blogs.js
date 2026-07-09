import { apiFetch } from "./api";

export function getAllBlogs() {
  return apiFetch("/blog");
}

export function getBlogById(blogId) {
  return apiFetch(`/blog/${blogId}`);
}

export function getUserBlogs() {
  return apiFetch(`/user/blogs`);
}

export function createBlog({ title, content, coverImage }) {
  const formData = new FormData();

  formData.append("title", title);
  formData.append("content", content);
  formData.append("coverImage", coverImage);

  return apiFetch("/blog/create", {
    method: "POST",
    body: formData,
  });
}

export function deleteBlog(id) {
  return apiFetch(`/blog/delete/${id}`, {
    method: "DELETE",
  });
}
