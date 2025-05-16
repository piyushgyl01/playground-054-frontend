import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/user`,
          {
            credentials: "include",
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (err) {
        console.error("Error checking authentication status", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const login = async (credentials) => {
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      console.log(err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (response.ok) {
        setUser(null);
        return { success: true };
      } else {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Token refresh failed");
      }

      return { success: true };
    } catch (err) {
      console.error("Error refreshing token", err);
      return { success: false, error: err.message };
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    refreshToken,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
