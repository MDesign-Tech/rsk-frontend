import axios from "axios";
import { API_BASE_URL } from "@/lib/constants";

// Reusable Axios instance for the RSK backend.
// withCredentials enables the HttpOnly auth cookie to be sent on every request.
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

// Normalize backend error responses into a single Error message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const data = error.response.data;
      const message =
        data.message ||
        (Array.isArray(data.errors) ? data.errors[0] : null) ||
        "Request failed";
      return Promise.reject(new Error(message));
    }
    if (error.request) {
      return Promise.reject(new Error("Network error. Please check your connection."));
    }
    return Promise.reject(new Error(error.message || "Something went wrong"));
  }
);

export default api;
