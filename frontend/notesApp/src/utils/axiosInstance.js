import axios from "axios";
import { BASE_URL } from "./constants";
import { useAuthStore } from "../store";
import { mutate as globalMutate } from "swr";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isHandlingUnauthorized = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const requestUrl = error?.config?.url || "";
    const isPublicAuthRoute =
      requestUrl.includes("/login") || requestUrl.includes("/create-account");

    if (status === 401 && !isPublicAuthRoute && !isHandlingUnauthorized) {
      isHandlingUnauthorized = true;

      const { setAccessToken, setUser } = useAuthStore.getState();
      setAccessToken(null);
      setUser(null);

      // Clear cached SWR data to prevent stale authenticated state.
      globalMutate(() => true, undefined, { revalidate: false });

      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.assign("/login");
      }

      setTimeout(() => {
        isHandlingUnauthorized = false;
      }, 0);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
