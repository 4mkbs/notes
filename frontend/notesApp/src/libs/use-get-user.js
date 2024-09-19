import axiosInstance from "../utils/axiosInstance";
import useSWR from "swr";

export const getUser = async () => {
  const response = await axiosInstance.get("/get-user");
  return response.data;
};

export const useGetUser = () => {
  const { data, error, isLoading } = useSWR("user", getUser);

  return {
    data,
    error,
    isLoading,
  };
};
