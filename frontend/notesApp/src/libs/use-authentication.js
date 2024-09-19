import { useAuthStore } from "../store";
import axiosInstance from "../utils/axiosInstance";

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
    } catch (error) {
      console.error(error);
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
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  return { login, logout, register };
};
