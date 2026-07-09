import { getUserBlogs } from "../api/blogs";
import { useState, useCallback, useEffect } from "react";
import BlogCard from "../components/BlogCard";

export default function UserBlogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUserBlogs = useCallback(async () => {
    try {
      const response = await getUserBlogs();

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }

      const data = await response.json();
      setError("");
      setUserBlogs(data.blogs);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBlogs();
  }, [fetchUserBlogs]);

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
  if (userBlogs.length === 0) {
    return <div className="container mt-5">No blogs found.</div>;
  }
  return (
    <div className="container">
      <div className="row mt-5">
        {userBlogs.map((blog) => (
          <BlogCard blog={blog} key={blog._id} />
        ))}
      </div>
    </div>
  );
}
