/**
 * Safely decodes a JWT token payload.
 * @param {string} token - JWT token string
 * @returns {object|null} Decoded payload or null if invalid
 */
export function decodeJwt(token) {
  try {
    if (!token || typeof token !== "string") return null;
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Pad base64 string if needed
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token or token decoding failed", e);
    return null;
  }
}

/**
 * Extracts username (sub) from JWT token.
 * @param {string} token - JWT token string
 * @returns {string|null} Username or null
 */
export function getUsernameFromJwt(token) {
  const decodedToken = decodeJwt(token);
  return decodedToken ? decodedToken.sub : null; // Replace 'sub' with the correct key if necessary
}
