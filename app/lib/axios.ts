import axios from "axios";
import Cookies from "js-cookie";

/**
 * Professional Axios Instance Configuration
 * Features: Base URL setup, Credentials support, and Header injection
 */
const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL || "https://lms-daqd.onrender.com/api/v1",
  withCredentials: true, // Crucial for sending and receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer Token from cookies before every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token");

    if (token) {
      // Set both Bearer token and ensure cookies are sent
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global errors like 401 (Unauthorized)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies and redirect to login if token is invalid or expired
      Cookies.remove("access_token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
