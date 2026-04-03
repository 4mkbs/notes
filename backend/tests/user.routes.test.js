const express = require("express");
const request = require("supertest");

jest.mock("../models/user.model", () => {
  const User = jest.fn(function MockUser(data) {
    Object.assign(this, data);
    this._id = this._id || "user-1";
    this.createdOn = this.createdOn || new Date("2025-01-01T00:00:00.000Z");
    this.save = jest.fn().mockResolvedValue(this);
  });

  User.findOne = jest.fn();

  return User;
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRouter = require("../routes/user");

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use(userRouter);
  return app;
};

describe("User routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("POST /create-account creates account with strong password", async () => {
    const app = createApp();
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashed-password");
    jwt.sign.mockReturnValue("signed-token");

    const response = await request(app).post("/create-account").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "Strong@123",
    });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.accessToken).toBe("signed-token");
    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(bcrypt.hash).toHaveBeenCalledWith("Strong@123", 10);
    expect(jwt.sign).toHaveBeenCalled();
  });

  test("POST /create-account rejects weak password", async () => {
    const app = createApp();

    const response = await request(app).post("/create-account").send({
      fullName: "Test User",
      email: "test@example.com",
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe(true);
    expect(User.findOne).not.toHaveBeenCalled();
  });

  test("POST /login returns 401 for unknown user", async () => {
    const app = createApp();
    User.findOne.mockResolvedValue(null);

    const response = await request(app).post("/login").send({
      email: "missing@example.com",
      password: "Strong@123",
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe(true);
    expect(response.body.message).toBe("Invalid credentials");
  });

  test("POST /login returns token for valid credentials", async () => {
    const app = createApp();
    User.findOne.mockResolvedValue({
      _id: "user-1",
      fullName: "Test User",
      email: "test@example.com",
      password: "hashed-password",
      createdOn: new Date("2025-01-01T00:00:00.000Z"),
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("signed-token");

    const response = await request(app).post("/login").send({
      email: "test@example.com",
      password: "Strong@123",
    });

    expect(response.status).toBe(200);
    expect(response.body.error).toBe(false);
    expect(response.body.accessToken).toBe("signed-token");
    expect(bcrypt.compare).toHaveBeenCalledWith(
      "Strong@123",
      "hashed-password"
    );
  });
});
