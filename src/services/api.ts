import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data) {
      const data = error.response.data;

      // If backend returns field-level validation errors, join them
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return Promise.reject(new Error(data.errors.join("\n")));
      }

      const message = data.message || "Request failed";
      return Promise.reject(new Error(message));
    }

    if (error.request) {
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(
      new Error(error.message || "Something went wrong")
    );
  }
);

export default api;