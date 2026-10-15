import test from "node:test";
import assert from "node:assert/strict";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import validate from "../src/middleware/validate.js";

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

test("validate middleware returns 400 and details for invalid input", () => {
  const middleware = validate(z.object({ name: z.string().min(3) }));
  const req = { body: { name: "Al" } } as Request;
  const res = makeResponse();
  let nextCalled = false;

  middleware(req, res as unknown as Response, (() => { nextCalled = true; }) as NextFunction);

  assert.equal(res.statusCode, 400);
  assert.equal(nextCalled, false);
  assert.equal(typeof res.body, "object");
  assert.ok(res.body && typeof res.body === "object" && "errors" in res.body);
});

test("validate middleware replaces the body with validated data and calls next", () => {
  const middleware = validate(z.object({ name: z.string().trim().min(3) }));
  const req = { body: { name: "  Alex  " } } as Request;
  const res = makeResponse();
  let nextCalled = false;

  middleware(req, res as unknown as Response, (() => { nextCalled = true; }) as NextFunction);

  assert.equal(req.body.name, "Alex");
  assert.equal(nextCalled, true);
});
