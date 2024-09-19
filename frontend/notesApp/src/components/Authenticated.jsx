import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";
import { useGetUser } from "../libs/use-get-user";
import { useEffect } from "react";

export const Authenticated = ({ children, revert = false }) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);

  const { data: user } = useGetUser();

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user]);

  if (revert && accessToken) {
    return <Navigate to="/" />;
  }

  if (!accessToken && !revert) {
    return <Navigate to="/login" />;
  }

  return children;
};
