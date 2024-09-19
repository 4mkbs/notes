import { useEffect } from "react";
import { useNotesStore } from "../store";
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
  const { data, error, isLoading, mutate } = useSWR(["notes", search], () =>
    getNotes(search)
  );

  const setNotes = useNotesStore((state) => state.setNotes);

  useEffect(() => {
    if (data) {
      setNotes(data.notes);
    }
  }, [data]);

  return {
    data: data?.notes ?? [],
    error,
    isLoading,
    mutate,
  };
};
