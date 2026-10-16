import test from "node:test";
import assert from "node:assert/strict";
import { careerChatSchema } from "../src/modules/ai/chat.validator.js";

const validQuestion = "How can I improve my resume for entry-level software engineering roles?";

test("careerChatSchema accepts a valid question without resume context", () => {
  assert.equal(careerChatSchema.safeParse({ question: validQuestion }).success, true);
});

test("careerChatSchema accepts a valid resume ID", () => {
  assert.equal(careerChatSchema.safeParse({ question: validQuestion, resumeId: "507f1f77bcf86cd799439011" }).success, true);
});

test("careerChatSchema rejects a missing or blank question", () => {
  assert.equal(careerChatSchema.safeParse({}).success, false);
  assert.equal(careerChatSchema.safeParse({ question: "   " }).success, false);
});

test("careerChatSchema rejects a question that is too short or too long", () => {
  assert.equal(careerChatSchema.safeParse({ question: "Hi" }).success, false);
  assert.equal(careerChatSchema.safeParse({ question: "x".repeat(2001) }).success, false);
});

test("careerChatSchema rejects an invalid resume ID", () => {
  assert.equal(careerChatSchema.safeParse({ question: validQuestion, resumeId: "bad-id" }).success, false);
});

test("careerChatSchema trims the question", () => {
  const result = careerChatSchema.safeParse({ question: `  ${validQuestion}  ` });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.question, validQuestion);
});
