import { Link } from "react-router-dom";

export default function BlogCard({ blog }) {
  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100">
        <img
          src={blog.coverImage}
          className="card-img-top"
          style={{ height: "200px", objectFit: "cover" }}
          alt="Blog cover image"
        />
        <div className="card-body">
          <h5 className="card-title">{blog.title}</h5>
          <p>{blog.views} views</p>
          <Link to={`/blog/${blog._id}`} className="btn btn-primary">
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
