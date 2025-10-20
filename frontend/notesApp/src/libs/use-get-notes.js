import { useEffect } from "react";
import { useAuthStore, useNotesStore } from "../store";
import axiosInstance from "../utils/axiosInstance";
import useSWR from "swr";

export const getNotes = async (search = "") => {
  const response = await axiosInstance.get(
    "/get-all-notes",
    search
      ? {
          params: { search },
        }
      : undefined
  );
  return response.data;
};

export const useGetNotes = (search = "") => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? ["notes", search] : null,
    () => getNotes(search)
  );

  const setNotes = useNotesStore((state) => state.setNotes);

  useEffect(() => {
    if (data) {
      setNotes(data.notes);
    }
  }, [data, setNotes]);

  return {
    data: data?.notes ?? [],
    error,
    isLoading,
    mutate,
  };
};
