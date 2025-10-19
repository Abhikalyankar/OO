
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import TokenService from "./tokenService";
import { BASE_URL2 } from "../utils/constants";

const loginEndpoint = BASE_URL2 + "/get-token/";
let consecutiveFailures: number = 0;
let toastTimeout: any = null;

// Create a function to get navigate outside of the interceptor
// This is needed because useNavigate hook can only be used within components
let navigateFunction: any = null;

export const setNavigateFunction = (navigate: any) => {
  // console.log("Navigate function set", navigate);
  navigateFunction = navigate;
};

// Helper function to safely navigate to login
const navigateToLogin = () => {
  // console.log("Attempting to navigate to login");
  
  // Remove token and user data first
  TokenService.removeToken();
  TokenService.removeCurrentUser();
  
  if (navigateFunction) {
    // console.log("Navigation function exists, navigating to /");
    try {
      navigateFunction("/");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback: try to redirect using window.location as a last resort
      window.location.href = "/";
    }
  } else {
    console.warn("Navigation function not set, using window.location fallback");
    // Fallback: direct location change if navigate function isn't available
    window.location.href = "/";
  }
};

const axiosInstance = axios.create({
  baseURL: BASE_URL2,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => {
    consecutiveFailures = 0;
    clearTimeout(toastTimeout);
    return res;
  },
  async (err) => {
    console.log("🚀 ~ err:", err)
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
        }, 10 * 1000);
      }
    }

    const originalConfig = err.config;
    
    if (originalConfig.url !== loginEndpoint && err.response) {
      // For no permission issues
      if (err.response.status === 403) {
        // Specifically check for invalid token in the detail field
        if (err.response.data?.detail && 
            typeof err.response.data.detail === 'string' && 
            err.response.data.detail.toLowerCase().includes('invalid token')) {
          
          // Display the error message
          toast.error(err.response.data.detail);
          
          // Use the helper function to navigate to login
          navigateToLogin();
          
          return Promise.reject(err);
        }
        
        // Check for error details in response data
        if (err?.response?.data?.error) {
          toast.error(`${err.response.data.error}\nContact Administrator!`);
          
          // Check if the error message contains "invalid token"
          if (typeof err.response.data.error === 'string' && 
              err.response.data.error.toLowerCase().includes('invalid token')) {
            // Clear token and user data
            TokenService.removeToken();
            TokenService.removeCurrentUser();
            
            // Navigate to login page if navigateFunction is available
            if (navigateFunction) {
              navigateFunction("/");
            }
          }
        } else if (err?.response?.data && Object.keys(err.response.data).length > 0) {
          const errors: Array<any> = Object.entries(err.response.data);
          errors.forEach((errorItem) => {
            // console.log("errorItem", errorItem);
            if (errorItem[0] === "error") {
              toast.error(errorItem[1]);
              
              // Check if the error message contains "invalid token"
              if (typeof errorItem[1] === 'string' && 
                  errorItem[1].toLowerCase().includes('invalid token')) {
                // Clear token and user data
                TokenService.removeToken();
                TokenService.removeCurrentUser();
                
                // Navigate to login page if navigateFunction is available
                if (navigateFunction) {
                  navigateFunction("/");
                }
              }
            } else if (errorItem[0] === "detail") {
              toast.error(errorItem[1]);
              
              // Check if the detail message contains "invalid token"
              if (typeof errorItem[1] === 'string' && 
                  errorItem[1].toLowerCase().includes('invalid token')) {
                // Clear token and user data
                TokenService.removeToken();
                TokenService.removeCurrentUser();
                
                // Navigate to login page if navigateFunction is available
                if (navigateFunction) {
                  navigateFunction("/");
                }
              }
            } else {
              toast.error(`${errorItem[0]}: ${errorItem[1]}`);
            }
          });
        } else {
          toast.error("Permission Denied \nContact Administrator");
        }
      }

      if (err.response.status === 500) {
        toast.error("Internal Server Issue!");
      }

      if (err.response.status === 400) {
        const errors: Array<any> = Object.entries(err.response.data);
        errors.forEach((errorItem) => {
          // console.log("errorItem", errorItem);
          if (errorItem[0] === "error") {
            toast.error(errorItem[1]);
          } else if (errorItem[0] === "detail") {
            toast.error(errorItem[1]);
          } else {
            toast.error(`${errorItem[0]}: ${errorItem[1]}`);
          }
        });
      }

      if (err.response.status === 401) {
        TokenService.removeToken();
        TokenService.removeCurrentUser();
        
        // Navigate to login page if navigateFunction is available
        if (navigateFunction) {
          navigateFunction("/");
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;