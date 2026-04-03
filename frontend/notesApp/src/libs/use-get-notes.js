import { useEffect } from "react";
import { useAuthStore, useNotesStore } from "../store";
import axiosInstance from "../utils/axiosInstance";
import useSWR from "swr";

export const getNotes = async (search = "", page = 1, limit = 20) => {
  const response = await axiosInstance.get("/get-all-notes", {
    params: { search, page, limit },
  });
  return response.data;
};

export const useGetNotes = (search = "", page = 1, limit = 20) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const { data, error, isLoading, mutate } = useSWR(
    accessToken ? ["notes", search, page, limit] : null,
    () => getNotes(search, page, limit),
    {
      shouldRetryOnError: false,
      onErrorRetry: (err) => {
        if (err?.response?.status === 401) {
          return;
        }
      },
    }
  );

  const setNotes = useNotesStore((state) => state.setNotes);
  const appendNotes = useNotesStore((state) => state.appendNotes);

  useEffect(() => {
    if (data) {
      if (page === 1) {
        setNotes(data.notes);
      } else {
        appendNotes(data.notes);
      }
    }
  }, [appendNotes, data, page, setNotes]);

  return {
    data: data?.notes ?? [],
    error,
    isLoading,
    mutate,
    pagination: data?.pagination,
  };
};
