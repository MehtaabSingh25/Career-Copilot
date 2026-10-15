import test from "node:test";
import assert from "node:assert/strict";
import { uploadResumeSchema } from "../src/modules/resume/resume.validator.js";

test("uploadResumeSchema accepts an omitted optional title", () => {
  assert.equal(uploadResumeSchema.safeParse({}).success, true);
});

test("uploadResumeSchema accepts a title within the supported length", () => {
  assert.equal(uploadResumeSchema.safeParse({ title: "Software Engineer Resume" }).success, true);
});

test("uploadResumeSchema rejects a title shorter than three characters", () => {
  assert.equal(uploadResumeSchema.safeParse({ title: "CV" }).success, false);
});

test("uploadResumeSchema rejects a title longer than one hundred characters", () => {
  assert.equal(uploadResumeSchema.safeParse({ title: "R".repeat(101) }).success, false);
});
