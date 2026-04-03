import { beforeEach, describe, expect, it } from "vitest";
import { useAuthStore } from "./auth-store";

describe("auth store", () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ accessToken: null, user: null });
  });

  it("starts with null auth state", () => {
    const state = useAuthStore.getState();
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });

  it("updates token and user", () => {
    const { setAccessToken, setUser } = useAuthStore.getState();

    setAccessToken("token-123");
    setUser({ _id: "u1", fullName: "Test User" });

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe("token-123");
    expect(state.user).toEqual({ _id: "u1", fullName: "Test User" });
  });
});
