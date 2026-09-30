import { createContext, useContext, useEffect, useState } from "react";
import {
  getToken,
  getCurrentUser,
  logout as logoutUser,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getToken());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCurrentUser = async () => {
      const currentToken = getToken();

      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        logoutUser();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadCurrentUser();
  }, []);

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      return currentUser;
    } catch (error) {
      logoutUser();
      setToken(null);
      setUser(null);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};