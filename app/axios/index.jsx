import axios from "axios";
import { toast } from "react-toastify";
import TokenService from "./tokenService";
import { BASE_URL2 } from "../utils/constants";

const loginEndpoint = BASE_URL2 + "/get-token/";
let consecutiveFailures = 0;
let toastTimeout = null;

// Store navigate function outside components
let navigateFunction = null;

export const setNavigateFunction = (navigate) => {
  navigateFunction = navigate;
};

// Helper to navigate to login safely
const navigateToLogin = () => {
  TokenService.removeToken();
  TokenService.removeCurrentUser();

  if (navigateFunction) {
    try {
      navigateFunction("/");
    } catch (error) {
      console.error("Navigation error:", error);
      window.location.href = "/";
    }
  } else {
    window.location.href = "/";
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL2,
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (res) => {
    consecutiveFailures = 0;
    clearTimeout(toastTimeout);
    return res;
  },
  async (err) => {
    console.log("🚀 ~ err:", err);
    consecutiveFailures++;
    clearTimeout(toastTimeout);

    if (err.code === "ERR_NETWORK") {
      if (consecutiveFailures >= 2) {
        toast.error("Apologies for the inconvenience, we will be back soon.");
        consecutiveFailures = 0;
      } else {
        toastTimeout = setTimeout(() => {
          toast.error("Apologies for the inconvenience, we will be back soon.");
          consecutiveFailures = 0;
        }, 10000);
      }
    }

    const originalConfig = err.config;

    if (originalConfig.url !== loginEndpoint && err.response) {
      // Handle 403 Forbidden
      if (err.response.status === 403) {
        const detail = err.response.data?.detail;
        const errorMsg = err.response.data?.error;

        if (detail && detail.toLowerCase().includes("invalid token")) {
          toast.error(detail);
          navigateToLogin();
          return Promise.reject(err);
        }

        if (errorMsg) {
          toast.error(`${errorMsg}\nContact Administrator!`);
          if (typeof errorMsg === "string" && errorMsg.toLowerCase().includes("invalid token")) {
            navigateToLogin();
          }
        } else if (err.response.data && Object.keys(err.response.data).length > 0) {
          Object.entries(err.response.data).forEach(([key, value]) => {
            toast.error(`${key}: ${value}`);
            if (typeof value === "string" && value.toLowerCase().includes("invalid token")) {
              navigateToLogin();
            }
          });
        } else {
          toast.error("Permission Denied \nContact Administrator");
        }
      }

      // Handle 500 Internal Server Error
      if (err.response.status === 500) {
        toast.error("Internal Server Issue!");
      }

      // Handle 400 Bad Request
      if (err.response.status === 400) {
        Object.entries(err.response.data).forEach(([key, value]) => {
          toast.error(`${key}: ${value}`);
        });
      }

      // Handle 401 Unauthorized
      if (err.response.status === 401) {
        navigateToLogin();
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
