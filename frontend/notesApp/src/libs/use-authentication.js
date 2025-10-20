import { useAuthStore } from "../store";
import axiosInstance from "../utils/axiosInstance";
import { mutate as globalMutate } from "swr";

export const useAuthentication = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  const login = async (email, password) => {
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch {
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      if (response.data && response.data.accessToken) {
        setAccessToken(response.data.accessToken);
        setUser(response.data.user);
        return true;
      }
    } catch {
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    // Clear SWR cache for user and any dependent keys
    globalMutate("user", null, { revalidate: false });
  };

  return { login, logout, register };
};
