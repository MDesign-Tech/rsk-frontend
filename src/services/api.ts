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

      const message =
        data.message ||
        (Array.isArray(data.errors) ? data.errors[0] : null) ||
        "Request failed";

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