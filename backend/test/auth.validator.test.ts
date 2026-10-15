import test from "node:test";
import assert from "node:assert/strict";
import { loginSchema, registerSchema } from "../src/modules/auth/auth.validator.js";

test("registerSchema accepts valid registration data", () => {
  const result = registerSchema.safeParse({
    name: "Mehtaab Singh",
    email: "mehtaab@example.com",
    password: "secure-password",
  });

  assert.equal(result.success, true);
});

test("registerSchema rejects a short name", () => {
  const result = registerSchema.safeParse({
    name: "Al",
    email: "mehtaab@example.com",
    password: "secure-password",
  });

  assert.equal(result.success, false);
});

test("registerSchema rejects an invalid email", () => {
  const result = registerSchema.safeParse({
    name: "Mehtaab Singh",
    email: "not-an-email",
    password: "secure-password",
  });

  assert.equal(result.success, false);
});

test("registerSchema rejects a password shorter than six characters", () => {
  const result = registerSchema.safeParse({
    name: "Mehtaab Singh",
    email: "mehtaab@example.com",
    password: "12345",
  });

  assert.equal(result.success, false);
});

test("loginSchema accepts valid login data", () => {
  const result = loginSchema.safeParse({
    email: "mehtaab@example.com",
    password: "secure-password",
  });

  assert.equal(result.success, true);
});

test("loginSchema rejects invalid login data", () => {
  const result = loginSchema.safeParse({
    email: "invalid-email",
    password: "123",
  });

  assert.equal(result.success, false);
});
