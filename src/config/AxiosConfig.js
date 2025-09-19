import axios from "axios";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081",
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Get the JWT token from cookies
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Defensive: handle missing error.response
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized, logging out...");
      Swal.fire({
        icon: "warning",
        text: "Session expired!!",
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) {
          Cookies.remove("token");
          window.location.href = "/login";
        }
      });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
