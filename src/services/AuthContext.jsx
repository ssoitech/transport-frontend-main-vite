import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { getUsernameFromJwt } from "./JwtUtils";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";

// Create a context for authentication
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const [accessDetails, setAccessDetailsState] = useState(() => {
    const stored = localStorage.getItem("accessDetails");
    return stored ? JSON.parse(stored) : null;
  });
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location (route)

  useEffect(() => {
    // Check if the user is authenticated on route change
    const token = Cookies.get("token");
    if (token) {
      setIsAuthenticated(true);
      setUsername(getUsernameFromJwt(token));
      // Restore accessDetails from localStorage if present
      const stored = localStorage.getItem("accessDetails");
      if (stored) {
        setAccessDetailsState(JSON.parse(stored));
      }
    } else {
      setIsAuthenticated(false);
      setUsername(null);
      setAccessDetailsState(null);
      localStorage.removeItem("accessDetails");
    }
  }, [location]);

  const login = useCallback(
    (token) => {
      Cookies.set("token", token, {
        expires: 1, // expires in 1 days
        secure: window.location.protocol === "https:", // ensures the cookie is sent only over HTTPS
        sameSite: "Lax", // mitigates CSRF attacks
      });
      setIsAuthenticated(true);
      setUsername(getUsernameFromJwt(token));
      navigate("/work-space"); // Redirect after login
    },
    [navigate]
  );

  const logout = useCallback(() => {
    Cookies.remove("token");
    setIsAuthenticated(false);
    setUsername(null);
    setAccessDetailsState(null);
    localStorage.removeItem("accessDetails");
    window.location.href = "/login"; // Redirect after logout
  }, []);

  // Custom setter to sync with localStorage
  const setAccessDetails = (details) => {
    setAccessDetailsState(details);
    if (details) {
      localStorage.setItem("accessDetails", JSON.stringify(details));
    } else {
      localStorage.removeItem("accessDetails");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        username,
        login,
        logout,
        accessDetails,
        setAccessDetails,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
