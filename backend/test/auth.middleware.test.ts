import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import type { NextFunction, Response } from "express";
import authMiddleware, { type AuthRequest } from "../src/middleware/auth.middleware.js";

process.env.JWT_SECRET = "automated-test-secret-do-not-use-in-production";

function makeResponse() {
  return {
    statusCode: 200,
    body: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

test("authMiddleware rejects a missing authorization header", () => {
  const req = { headers: {} } as AuthRequest;
  const res = makeResponse();
  let nextCalled = false;

  authMiddleware(req, res as unknown as Response, (() => { nextCalled = true; }) as NextFunction);

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("authMiddleware rejects an invalid bearer token", () => {
  const req = { headers: { authorization: "Bearer invalid-token" } } as AuthRequest;
  const res = makeResponse();
  let nextCalled = false;

  authMiddleware(req, res as unknown as Response, (() => { nextCalled = true; }) as NextFunction);

  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test("authMiddleware attaches the verified user and calls next", () => {
  const token = jwt.sign({ id: "test-user-id" }, process.env.JWT_SECRET!);
  const req = { headers: { authorization: `Bearer ${token}` } } as AuthRequest;
  const res = makeResponse();
  let nextCalled = false;

  authMiddleware(req, res as unknown as Response, (() => { nextCalled = true; }) as NextFunction);

  assert.equal(req.user?.id, "test-user-id");
  assert.equal(nextCalled, true);
});
