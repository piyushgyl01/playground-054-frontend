import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function NotFoundPage() {
  return (
    <div className="container text-center py-5">
      <h1 className="display-1 fw-bold">404</h1>
      <h2 className="mb-4">Page Not Found</h2>
      <p className="lead mb-5">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="btn btn-primary btn-lg d-inline-flex align-items-center"
      >
        <FaArrowLeft className="me-2" /> Go to Home Page
      </Link>
    </div>
  );
}
