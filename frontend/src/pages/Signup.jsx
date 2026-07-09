import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { signup } from "../api/auth";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function Signup() {
  const { refreshUser } = useContext(AuthContext);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      setError("");

      const response = await signup({ fullName, email, password });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message);
        return;
      }
      await refreshUser();
      navigate("/");
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <>
      <div className="container mt-5">
        {error && <div className="alert alert-danger">{error}</div>}
        <h1 className="my-4">Create a New Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="fullName" className="form-label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-control"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating account..." : "Submit"}
          </button>
        </form>
        <h4 className="my-3">OR</h4>
        <Link to="/login">Login to existing account</Link>
      </div>
    </>
  );
}
