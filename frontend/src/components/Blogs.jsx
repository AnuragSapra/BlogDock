import { useState, useEffect, useCallback } from "react";
import BlogCard from "./BlogCard";
import { getAllBlogs } from "../api/blogs";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBlogs = useCallback(async () => {
    try {
      const response = await getAllBlogs();

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setError("");
      setBlogs(data.blogs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  if (loading) {
    return <div className="container mt-5">Loading...</div>;
  }
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }
  if (blogs.length === 0) {
    return <div className="container mt-5">No blogs found.</div>;
  }
  return (
    <div className="container">
      <div className="row mt-5">
        {blogs.map((blog) => (
          <BlogCard blog={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}
