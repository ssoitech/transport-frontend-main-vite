import { setToken } from "../services/AuthServices";

/**
 * Validate user credentials against hardcoded data.
 * @param {string} email
 * @param {string} password
 * @returns {boolean} true if valid, false otherwise
 */
export function validateUser(email, password) {
  const data = [
    { userId: "Mdas", pass: "mdas@123" },
    { userId: "Bmishra", pass: "bmishra@123" },
    { userId: "Admin", pass: "admin@123" },
  ];
  const user = data.find(
    (element) => element.userId === email && element.pass === password
  );
  if (user) {
    console.log("Match");
    setToken(user.userId);
    return true;
  }
  return false;
}

/**
 * Check if user is authenticated (token exists)
 * @returns {boolean}
 */
export function isAuthenticated() {
  // Example: check localStorage for token
  return Boolean(localStorage.getItem("token"));
}
