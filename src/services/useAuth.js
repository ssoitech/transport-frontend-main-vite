import { useContext } from "react";
import { AuthContext } from "./AuthContext";

/**
 * Custom hook to use AuthContext
 * @returns {object} Auth context value
 */
export const useAuth = () => useContext(AuthContext);
