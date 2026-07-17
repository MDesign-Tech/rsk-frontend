import axios from "axios";

// BFF: the browser only ever talks to the Next.js frontend (/api/*).
// Route handlers in src/app/api/* forward requests to the Express backend.
// withCredentials enables the HttpOnly auth cookie to be sent on every request
// and lets the browser store the cookie on the FRONTEND domain (first-party).
const api = axios.create({
  baseURL: "/api",
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
