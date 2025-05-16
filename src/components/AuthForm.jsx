import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function AuthForm({ mode }) {
  const isLogin = mode === "login";
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [formData, setFormData] = useState({
    username: "",
    name: isLogin ? undefined : "",
    email: isLogin ? undefined : "",
    password: "",
    confirmPassword: isLogin ? undefined : "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateInputs = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (!isLogin) {
      if (formData.password.length < 8) {
        setError("Password must be at least 8 characters long");
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }

      if (!formData.name.trim()) {
        setError("Name is required");
        return false;
      }

      if (!formData.email.trim()) {
        setError("Email is required");
        return false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      let result;

      if (isLogin) {
        const credentials = {
          username: formData.username,
          password: formData.password,
        };

        result = await login(credentials);
      } else {
        const { confirmPassword, ...registrationData } = formData;

        result = await register(registrationData);
      }

      if (result.success) {
        navigate("/");
      } else {
        setError(result.error || `Failed to ${isLogin ? "login" : "register"}`);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow border-0">
            <div className="card-body p-4">
              <h2 className="card-title mb-4 text-center">
                {isLogin ? "Login" : "Register"}
              </h2>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={!isLogin ? 8 : undefined}
                  />
                  {!isLogin && (
                    <small className="text-muted">
                      Password must be at least 8 characters long
                    </small>
                  )}
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="d-grid gap-2">
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {isLogin ? "Logging in..." : "Registering..."}
                      </>
                    ) : isLogin ? (
                      "Login"
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-3 text-center">
                {isLogin ? (
                  <p>
                    Don't have an account? <Link to="/register">Register</Link>
                  </p>
                ) : (
                  <p>
                    Already have an account? <Link to="/login">Login</Link>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
