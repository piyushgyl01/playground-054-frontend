import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { Link } from "react-router-dom";

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch(
    `${import.meta.env.VITE_API_URL}/tools/${id}`
  );

  async function handleDelete() {
    if (window.confirm("Are you sure you want to delete this tool?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/tools/${id}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  return (
    <div className="container my-5">
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {data && (
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h2 className="card-title">{data.devToolName}</h2>
            <h6 className="card-subtitle">Builder: {data.devToolBuilder}</h6>
          </div>
          <div className="card-body">
            <p className="card-text">Description: {data.devToolDesciption}</p>

            <div className="mt-4">
              <h5>Additional Information:</h5>
              <ul className="list-group list-group-flush mb-4">
                <li className="list-group-item">
                  <strong>Created:</strong>{" "}
                  {new Date(data.createdAt).toLocaleString()}
                </li>
                <li className="list-group-item">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(data.updatedAt).toLocaleString()}
                </li>
              </ul>
            </div>
          </div>
          <div className="card-footer d-flex justify-content-between">
            <div>
              <Link to="/" className="btn btn-secondary me-2">
                Back to List
              </Link>
            </div>
            <div>
              <Link to={`/update/${data._id}`} className="btn btn-warning me-2">
                Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}