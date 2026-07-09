import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getBlogById } from "../api/blogs";
import { useCallback } from "react";
import { useEffect } from "react";
import { createComment } from "../api/comment";
import { deleteBlog } from "../api/blogs";

export default function ViewBlog() {
  const { user } = useContext(AuthContext);
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlog = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getBlogById(blogId);

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setError("");
      setBlog(data.blog);
      setComments(data.comments);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [blogId]);
  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  async function handleDelete() {
    if (isDeleting) return;
    setError("");

    const confirmed = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await deleteBlog(blog._id);

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      navigate("/");
    } catch {
      setError("Couldn't delete the blog.");
    } finally {
      setIsDeleting(false);
    }
  }

  async function postComment() {
    try {
      if (!comment.trim()) return;
      setError("");

      const response = await createComment({
        blogId: blog._id,
        content: comment,
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const newComment = await response.json();

      setComments((prev) => [...prev, newComment]);
      setComment("");
      setError("");
    } catch (error) {
      setError("Couldn't post the comment.");
    }
  }

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }
  if (!blog) {
    return (
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    );
  }
  return (
    <>
      <div className="container my-5">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <div>
          {user && user.role === "Admin" ? (
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Blog"}
            </button>
          ) : null}
        </div>
        <img
          width="60%"
          src={blog.coverImage}
          className="rounded mx-auto d-block"
        />
        <h1 className="my-5 text-center">{blog.title}</h1>
        <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
        <p>Posted By: {blog.createdBy.fullName}</p>
      </div>
      <div className="container">
        <h5>Comments ({comments.length})</h5>
        {comments.map((comment) => (
          <div key={comment._id} className="py-3 border-top border-bottom">
            <h6 className="mb-2">{comment.createdBy.fullName}</h6>
            <p className="mb-2">{comment.content}</p>
            <small className="text-muted">
              {new Date(comment.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </small>
          </div>
        ))}
      </div>
      {user ? (
        <div className="container my-5">
          <input
            id="comment-input"
            className="form-control"
            type="text"
            placeholder="Enter your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={postComment} className="btn btn-success my-3">
            Post
          </button>
        </div>
      ) : null}
    </>
  );
}
