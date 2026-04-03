import { describe, expect, it } from "vitest";
import { getInitials, validateEmail, validatePassword } from "./helper";

describe("helper utilities", () => {
  it("validates email correctly", () => {
    expect(validateEmail("user@example.com")).toBe(true);
    expect(validateEmail("invalid-email")).toBe(false);
  });

  it("validates strong password policy", () => {
    expect(validatePassword("Strong@123")).toBe(true);
    expect(validatePassword("weakpass")).toBe(false);
  });

  it("builds initials from full name", () => {
    expect(getInitials("Sakib Hasan")).toBe("SH");
    expect(getInitials("  single  ")).toBe("S");
    expect(getInitials("")).toBe("");
  });
});
