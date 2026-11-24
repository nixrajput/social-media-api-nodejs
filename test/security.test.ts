import { afterAll, afterEach, beforeAll, describe, expect, mock, spyOn, test } from "bun:test";
import type { Server } from "node:http";
import type { AddressInfo } from "node:net";
import jwt from "jsonwebtoken";

Object.assign(process.env, {
  NODE_ENV: "test",
  MONGO_URI: "mongodb://127.0.0.1:1",
  DB_NAME: "test",
  CORS_ENABLED: "true",
  JWT_SECRET: "test-secret",
  JWT_EXPIRES_IN: "1h",
  SENDGRID_API_KEY: "SG.test",
  SMTP_FROM: "noreply@example.test",
  CLOUDINARY_CLOUD_NAME: "test",
  CLOUDINARY_API_KEY: "test",
  CLOUDINARY_API_SECRET: "test",
});
for (const key of [
  "TYPE",
  "PROJECT_ID",
  "PRIVATE_KEY_ID",
  "PRIVATE_KEY",
  "CLIENT_EMAIL",
  "CLIENT_ID",
  "AUTH_URI",
  "TOKEN_URI",
  "AUTH_PROVIDER_X509_CERT_URL",
  "CLIENT_X509_CERT_URL",
]) {
  process.env[`FIREBASE_${key}`] = "test";
}

const { default: app } = await import("../src/app");
const { default: User } = await import("../src/models/User");
const { default: Otp } = await import("../src/models/Otp");
const { default: AuthToken } = await import("../src/models/AuthToken");

let server: Server;
let base: string;

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.express.listen(0, "127.0.0.1", () => {
      base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
      resolve();
    });
  });
});

afterAll(() => {
  server.close();
});

afterEach(() => {
  mock.restore();
});

// Each test uses its own client IP, because the auth routes share one rate limiter.
const post = (path: string, body: unknown, ip: string, forwardedFor = ip) =>
  fetch(`${base}/api/v1/auth${path}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": forwardedFor },
    body: JSON.stringify(body),
  });

describe("rate limiting on auth routes", () => {
  test("the limiter runs before the controller", async () => {
    const statuses: number[] = [];
    for (let i = 0; i < 11; i++) {
      statuses.push((await post("/login", {}, "10.0.0.1")).status);
    }
    expect(statuses.slice(0, 10).every((s) => s === 400)).toBe(true);
    expect(statuses[10]).toBe(429);
  });

  test("a client cannot reset the limit with a spoofed X-Forwarded-For entry", async () => {
    let last = 0;
    for (let i = 1; i <= 11; i++) {
      last = (await post("/login", {}, "", `${i}.1.1.1, 10.0.0.2`)).status;
    }
    expect(last).toBe(429);
  });
});

describe("NoSQL operator injection", () => {
  test("operator objects in login and password-reset bodies never reach a query", async () => {
    const filters: unknown[] = [];
    spyOn(User, "findOne").mockImplementation(((filter: unknown) => {
      filters.push(filter);
      return Promise.resolve(null);
    }) as never);
    spyOn(Otp, "findOne").mockImplementation(((filter: unknown) => {
      filters.push(filter);
      return Promise.resolve(null);
    }) as never);

    const password = "password123";
    const attempts = [
      post("/login", { email: { $ne: null }, password }, "10.0.1.1"),
      post("/login", { email: ["a@example.test"], password }, "10.0.1.2"),
      post(
        "/send-reset-password-otp",
        { email: { $gt: "" }, password, confirmPassword: password },
        "10.0.1.3"
      ),
      post(
        "/reset-password",
        {
          email: "user@example.test",
          password,
          confirmPassword: password,
          otp: { $ne: "000000", length: 6 },
        },
        "10.0.1.4"
      ),
    ];
    for (const res of await Promise.all(attempts)) {
      expect(res.status).toBe(400);
    }

    for (const filter of filters) {
      for (const value of Object.values(filter as object)) {
        expect(typeof value).toBe("string");
      }
    }
  });
});

describe("password reset", () => {
  test("the reset-OTP request does not reveal whether an email is registered", async () => {
    spyOn(User, "findOne").mockResolvedValue(null as never);
    const password = "password123";
    const res = await post(
      "/send-reset-password-otp",
      { email: "nobody@example.test", password, confirmPassword: password },
      "10.0.2.1"
    );
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, message: "Sucess" });
  });

  test("an unknown email and a wrong OTP get the same answer", async () => {
    const password = "password123";
    const body = { password, confirmPassword: password, otp: "123456" };

    spyOn(User, "findOne").mockResolvedValue(null as never);
    const unknown = await post("/reset-password", { ...body, email: "nobody@example.test" }, "10.0.2.2");

    mock.restore();
    spyOn(User, "findOne").mockResolvedValue({ _id: "u1" } as never);
    spyOn(Otp, "findOne").mockResolvedValue(null as never);
    const wrongOtp = await post("/reset-password", { ...body, email: "user@example.test" }, "10.0.2.3");

    expect(unknown.status).toBe(400);
    expect(wrongOtp.status).toBe(400);
    expect(await unknown.json()).toEqual(await wrongOtp.json());
  });

  test("a new password revokes every stored token of the user", async () => {
    const deleteMany = spyOn(AuthToken, "deleteMany").mockResolvedValue({} as never);
    spyOn(AuthToken, "create").mockImplementation((async (doc: object) => doc) as never);
    const user = new User({ fname: "Test", lname: "User", email: "user@example.test", username: "test" });

    await user.getToken(true);

    expect(deleteMany).toHaveBeenCalledWith({ userId: user._id });
  });
});

describe("error responses", () => {
  const authHeader = () => ({
    authorization: `Bearer ${jwt.sign({ id: "507f1f77bcf86cd799439011" }, "test-secret")}`,
  });

  test("a 5xx response hides the internal error message", async () => {
    spyOn(AuthToken, "findOne").mockResolvedValue({
      userId: "507f1f77bcf86cd799439011",
      isExpired: async () => false,
    } as never);
    spyOn(User, "findById").mockRejectedValue(new Error("connect ECONNREFUSED 10.9.8.7:27017"));

    const res = await fetch(`${base}/api/v1/auth/me`, { headers: authHeader() });
    const text = await res.text();

    expect(res.status).toBe(500);
    expect(JSON.parse(text)).toEqual({ success: false, error: "Internal server error" });
    expect(text).not.toContain("10.9.8.7");
  });

  test("the profile response carries no password hash, salt or token", async () => {
    spyOn(AuthToken, "findOne").mockResolvedValue({
      userId: "507f1f77bcf86cd799439011",
      isExpired: async () => false,
    } as never);
    spyOn(User, "findById").mockResolvedValue({ password: "hash-value", salt: "salt-value" } as never);

    const res = await fetch(`${base}/api/v1/auth/me`, { headers: authHeader() });
    const text = await res.text();

    expect(res.status).toBe(201);
    expect(text).not.toContain("hash-value");
    expect(text).not.toContain("salt-value");
    expect(text).not.toContain("Bearer");
  });

  test("an error outside the API prefix returns JSON, not a stack trace", async () => {
    const res = await fetch(`${base}/`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{bad json",
    });
    const text = await res.text();

    expect(res.status).toBe(400);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(text).not.toContain("    at ");
  });

  test("unknown paths get the JSON 404 and the root path reports online", async () => {
    const missing = await fetch(`${base}/no-such-path`);
    expect(missing.status).toBe(404);
    expect((await missing.json()).error).toBe("Path not found");

    const root = await fetch(`${base}/`);
    expect(root.status).toBe(200);
    expect((await root.json()).server).toBe("online");
  });
});

test("CORS does not combine a wildcard origin with credentials", async () => {
  const res = await fetch(`${base}/`, { headers: { origin: "https://attacker.example" } });
  expect(res.headers.get("access-control-allow-origin")).toBe("*");
  expect(res.headers.get("access-control-allow-credentials")).toBeNull();
});
