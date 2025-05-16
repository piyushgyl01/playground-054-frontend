import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer mt-5 py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-6 text-center text-md-start">
            <Link to="/" className="text-decoration-none">
              <h5 className="mb-0 text-success">Blogify</h5>
            </Link>
            <p className="text-muted small mb-0">
              A place to share knowledge and ideas.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <p className="text-muted small mb-0">
              &copy; {currentYear} Blogify. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
