import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import { useAuth } from "../contexts/authContext";
import { FaHeart, FaRegHeart, FaEdit, FaTrash } from "react-icons/fa";

export default function Article() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [postingComment, setPostingComment] = useState(false);

  const {
    data: articleData = { article: null },
    loading: articleLoading,
    error: articleError,
    refetch: refetchArticle,
  } = useFetch(`${import.meta.env.VITE_API_URL}/articles/${id}`);

  const article = articleData.article || null;

  const {
    data: commentsData = { comments: [] },
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useFetch(`${import.meta.env.VITE_API_URL}/articles/${id}/comments`);

  const comments = commentsData.comments || [];

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleFavorite = async () => {
    if (!isAuthenticated || !article) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${article._id}/favorite`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        refetchArticle();
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleEdit = () => {
    navigate(`/editor/${article._id}`);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${article._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        setShowDeleteModal(false);
        navigate("/");
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentBody.trim() || !isAuthenticated) return;

    try {
      setPostingComment(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${article._id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ body: commentBody }),
        }
      );

      if (response.ok) {
        setCommentBody("");
        refetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/articles/${
          article._id
        }/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        refetchComments();
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  if (articleLoading || !article) {
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

  if (articleError) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {articleError || "Failed to load article. Please try again."}
        </div>
      </div>
    );
  }

  const isAuthor = user && article.author && user._id === article.author._id;

  return (
    <div className="article-page">
      <div className="py-5 bg-dark text-white mb-4">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="d-flex align-items-center mt-4">
            <img
              src={article.author?.image || "https://via.placeholder.com/50"}
              alt={article.author?.username}
              className="rounded-circle me-2"
              style={{ width: "50px", height: "50px" }}
            />
            <div>
              <Link
                to={`/profile/${article.author?.username}`}
                className="text-white text-decoration-none fw-bold"
              >
                {article.author?.username}
              </Link>
              <div className="text-light">{formatDate(article.createdAt)}</div>
            </div>

            {isAuthenticated && (
              <div className="ms-auto">
                {isAuthor ? (
                  <>
                    <button
                      className="btn btn-outline-light btn-sm me-2"
                      onClick={handleEdit}
                    >
                      <FaEdit className="me-1" /> Edit
                    </button>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={handleDelete}
                    >
                      <FaTrash className="me-1" /> Delete
                    </button>
                  </>
                ) : (
                  <button
                    className={`btn ${
                      article.favorited ? "btn-primary" : "btn-outline-light"
                    } btn-sm`}
                    onClick={handleFavorite}
                  >
                    {article.favorited ? (
                      <FaHeart className="me-1" />
                    ) : (
                      <FaRegHeart className="me-1" />
                    )}
                    {article.favouritesCount || 0} Favorite
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-8 mx-auto">
            <div className="article-body mb-5">
              <div className="mb-4">
                {article.description && (
                  <p className="lead text-muted">{article.description}</p>
                )}
                <div className="mt-4">
                  {article.body
                    .split("\n")
                    .map((paragraph, index) =>
                      paragraph ? (
                        <p key={index}>{paragraph}</p>
                      ) : (
                        <br key={index} />
                      )
                    )}
                </div>
              </div>
            </div>

            <div className="mb-5">
              {article.tagList &&
                article.tagList.map((tag) => (
                  <span className="badge bg-secondary me-1" key={tag}>
                    {tag}
                  </span>
                ))}
            </div>

            <hr className="my-4" />

            <div className="article-actions d-flex justify-content-center mb-5">
              {isAuthenticated && (
                <>
                  {isAuthor ? (
                    <>
                      <button
                        className="btn btn-outline-secondary me-2"
                        onClick={handleEdit}
                      >
                        <FaEdit className="me-1" /> Edit Article
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={handleDelete}
                      >
                        <FaTrash className="me-1" /> Delete Article
                      </button>
                    </>
                  ) : (
                    <button
                      className={`btn ${
                        article.favorited
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={handleFavorite}
                    >
                      {article.favorited ? (
                        <FaHeart className="me-1" />
                      ) : (
                        <FaRegHeart className="me-1" />
                      )}
                      {article.favouritesCount || 0} Favorite Article
                    </button>
                  )}
                </>
              )}
            </div>

            <hr className="my-4" />

            <div className="comments-section">
              <h3 className="mb-4">Comments</h3>

              {isAuthenticated ? (
                <div className="card mb-4">
                  <div className="card-body">
                    <form onSubmit={handleCommentSubmit}>
                      <div className="mb-3">
                        <textarea
                          className="form-control"
                          rows="3"
                          placeholder="Write a comment..."
                          value={commentBody}
                          onChange={(e) => setCommentBody(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              user?.image || "https://via.placeholder.com/30"
                            }
                            alt={user?.username}
                            className="rounded-circle me-2"
                            style={{ width: "30px", height: "30px" }}
                          />
                          <span className="text-muted">{user?.username}</span>
                        </div>
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={postingComment || !commentBody.trim()}
                        >
                          {postingComment ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-1"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              Posting...
                            </>
                          ) : (
                            "Post Comment"
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center mb-4">
                  <Link to="/login" className="btn btn-outline-primary">
                    Sign in to add a comment
                  </Link>
                </div>
              )}

              {commentsLoading ? (
                <div className="text-center my-4">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading comments...</span>
                  </div>
                </div>
              ) : comments.length > 0 ? (
                comments.map((comment) => (
                  <div className="card mb-3" key={comment._id}>
                    <div className="card-body">
                      <p className="card-text">{comment.body}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              comment.author?.image ||
                              "https://via.placeholder.com/30"
                            }
                            alt={comment.author?.username}
                            className="rounded-circle me-2"
                            style={{ width: "30px", height: "30px" }}
                          />
                          <div>
                            <Link
                              to={`/profile/${comment.author?.username}`}
                              className="text-decoration-none fw-bold"
                            >
                              {comment.author?.username}
                            </Link>
                            <div className="text-muted small">
                              {formatDate(comment.createdAt)}
                            </div>
                          </div>
                        </div>
                        {isAuthenticated &&
                          user?._id === comment.author?._id && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              <FaTrash />
                            </button>
                          )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted my-4">
                  <p>No comments yet. Be the first to share your thoughts!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete this article? This action
                  cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
