import axiosInstance from "../utils/axiosInstance";
import useSWR from "swr";
import { useAuthStore } from "../store";

export const getUser = async () => {
  const response = await axiosInstance.get("/get-user");
  return response.data;
};

export const useGetUser = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  // Only fetch when we have a token; otherwise skip to avoid 401 spam
  const { data, error, isLoading } = useSWR(
    accessToken ? "user" : null,
    getUser
  );

  return {
    data,
    error,
    isLoading,
  };
};
