import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/authContext";

export default function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    body: "",
    tagList: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [articleLoading, setArticleLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (id) {
      setIsEditing(true);
      fetchArticle(id);
    }
  }, [id]);

  const fetchArticle = async (articleId) => {
    try {
      setArticleLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${articleId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch article");
      }

      const data = await response.json();
      if (data.article) {
        setFormData({
          title: data.article.title || "",
          description: data.article.description || "",
          body: data.article.body || "",
          tagList: data.article.tagList || [],
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setArticleLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (!formData.body.trim()) errors.body = "Content is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !formData.tagList.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tagList: [...prev.tagList, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tagList: prev.tagList.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);

      const url = isEditing
        ? `${import.meta.env.VITE_API_URL}/articles/${id}`
        : `${import.meta.env.VITE_API_URL}/articles`;

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save article");
      }

      const result = await response.json();
      navigate(`/article/${result.article._id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing && articleLoading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <h1 className="text-center mb-4">
            {isEditing ? "Edit Article" : "New Article"}
          </h1>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="articleTitle" className="form-label">
                Title
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.title ? "is-invalid" : ""
                }`}
                id="articleTitle"
                name="title"
                placeholder="Article Title"
                value={formData.title}
                onChange={handleChange}
              />
              {formErrors.title && (
                <div className="invalid-feedback">{formErrors.title}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="articleDescription" className="form-label">
                Description
              </label>
              <input
                type="text"
                className={`form-control ${
                  formErrors.description ? "is-invalid" : ""
                }`}
                id="articleDescription"
                name="description"
                placeholder="What's this article about?"
                value={formData.description}
                onChange={handleChange}
              />
              {formErrors.description && (
                <div className="invalid-feedback">{formErrors.description}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="articleBody" className="form-label">
                Content (supports Markdown)
              </label>
              <textarea
                className={`form-control ${
                  formErrors.body ? "is-invalid" : ""
                }`}
                id="articleBody"
                name="body"
                rows="8"
                placeholder="Write your article (in markdown)"
                value={formData.body}
                onChange={handleChange}
              ></textarea>
              {formErrors.body && (
                <div className="invalid-feedback">{formErrors.body}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="articleTags" className="form-label">
                Tags
              </label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  id="articleTags"
                  placeholder="Enter tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyPress={(e) => e.key === "Enter" && addTag(e)}
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={addTag}
                >
                  Add
                </button>
              </div>

              <div className="mt-2">
                {formData.tagList.map((tag) => (
                  <span
                    key={tag}
                    className="badge bg-secondary me-1 mb-1 d-inline-flex align-items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.5rem" }}
                      onClick={() => removeTag(tag)}
                      aria-label={`Remove ${tag} tag`}
                    ></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Saving...
                  </>
                ) : (
                  "Publish Article"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
