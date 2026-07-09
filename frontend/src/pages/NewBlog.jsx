import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createBlog } from "../api/blogs";

export default function NewBlog() {
  const [title, setTitle] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  async function handleSubmit(event) {
    event.preventDefault();
    if (!coverImage) {
      setError("Please select an image.");
      return;
    }

    if (!coverImage?.type.startsWith("image/")) {
      setError("Please upload a valid image.");
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setError("");

      const response = await createBlog({ title, content, coverImage });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }
      navigate("/");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="container">
      <div className="my-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <h1>Create new blog</h1>
      </div>
      <form
        className="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <div className="mb-3">
          <label htmlFor="coverImage" className="form-label">
            Cover Image
          </label>
          <input
            id="coverImage"
            className="form-control mt-2"
            type="file"
            name="coverImage"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files[0])}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            id="content"
            name="content"
            className="form-control"
            style={{
              fieldSizing: "content",
              minHeight: "8lh",
              resize: "none",
            }}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          ></textarea>
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      </form>
    </div>
  );
}
