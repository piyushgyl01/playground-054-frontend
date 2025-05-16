import { Link, useNavigate } from "react-router-dom";
import { FaPenSquare, FaUserCircle, FaCog } from "react-icons/fa";
import { useAuth } from "../contexts/authContext";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }

  return (
    <nav className="navbar navbar-expand-lg bg-light mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold text-success fs-2" to="/">
          Blogify
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#basic-navbar-nav"
          aria-controls="basic-navbar-nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="basic-navbar-nav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to="/editor"
                  >
                    <FaPenSquare className="me-1" /> New Post
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to="/settings"
                  >
                    <FaCog className="me-1" /> Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to={`/profile/${user?.username}`}
                  >
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.username}
                        style={{
                          width: "24px",
                          height: "24px",
                          borderRadius: "50%",
                          marginRight: "5px",
                        }}
                      />
                    ) : (
                      <FaUserCircle className="me-1" />
                    )}
                    {user?.username}
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline-secondary btn-sm ms-2"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Sign in
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
