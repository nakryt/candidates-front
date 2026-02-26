import axios, { AxiosError } from "axios";
import { API_URL } from "./constants";
import type { ApiError } from "./types";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    ...(import.meta.env.VITE_API_KEY
      ? { "X-API-Key": import.meta.env.VITE_API_KEY as string }
      : {}),
  },
});

api.interceptors.response.use(
  (response) => response,

  (error: AxiosError<ApiError>) => {
    if (!error.response) {
      const networkError: ApiError = {
        message:
          error.message === "Network Error"
            ? "Unable to connect to the server. Please check your internet connection."
            : error.message || "Network error occurred",
        statusCode: 0,
        code: "NETWORK_ERROR",
      };

      console.error("Network error:", networkError);
      return Promise.reject(networkError);
    }

    const apiError: ApiError = {
      message:
        error.response.data?.message ||
        error.message ||
        "An unexpected error occurred",
      statusCode: error.response.status,
      errors: error.response.data?.errors,
      code: error.response.data?.code || `HTTP_${error.response.status}`,
    };

    return Promise.reject(apiError);
  },
);

export default api;
