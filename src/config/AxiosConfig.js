import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from "sweetalert2";



// Create an Axios instance
const axiosInstance = axios.create({
    // baseURL: 'https://swastik.ssoitech.com',
    baseURL: 'http://localhost:8081', // Replace with API base URL
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = Cookies.get('token'); // Get the JWT token from cookies

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // workstation
            // proxy
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response.status === 401) {
            // Handle unauthorized access (e.g., redirect to login page)
            console.error('Unauthorized, logging out...');
            // Optional: Clear cookies and redirect to login

            Swal.fire({
                icon: "warning",
                text: "Session expired!!",
                confirmButtonText: "Login",
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    Cookies.remove("token");
                    window.location.href = '/login';

                }
            });
        }
        return Promise.reject(error);
    }
);


export default axiosInstance;
