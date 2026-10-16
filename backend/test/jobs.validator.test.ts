import test from "node:test";
import assert from "node:assert/strict";
import { createJobMatchSchema } from "../src/modules/jobs/jobs.validator.js";

const validInput = {
  resumeId: "507f1f77bcf86cd799439011",
  jobTitle: "Software Engineer",
  company: "Example Corp",
  jobDescription: "A software engineer is needed to build and maintain web applications, collaborate with product teams, review code, and improve system reliability. Experience with TypeScript and APIs is preferred.",
};

test("createJobMatchSchema accepts valid job matching input", () => {
  assert.equal(createJobMatchSchema.safeParse(validInput).success, true);
});

test("createJobMatchSchema rejects an invalid resume ID", () => {
  assert.equal(createJobMatchSchema.safeParse({ ...validInput, resumeId: "not-an-id" }).success, false);
});

test("createJobMatchSchema rejects a blank job title", () => {
  assert.equal(createJobMatchSchema.safeParse({ ...validInput, jobTitle: "   " }).success, false);
});

test("createJobMatchSchema rejects a job description shorter than 100 characters", () => {
  assert.equal(createJobMatchSchema.safeParse({ ...validInput, jobDescription: "Build software." }).success, false);
});

test("createJobMatchSchema rejects a job description longer than 20,000 characters", () => {
  assert.equal(createJobMatchSchema.safeParse({ ...validInput, jobDescription: "x".repeat(20001) }).success, false);
});

test("createJobMatchSchema trims text and defaults an omitted company", () => {
  const result = createJobMatchSchema.safeParse({
    ...validInput,
    jobTitle: "  Software Engineer  ",
    company: undefined,
  });

  assert.equal(result.success, true);
  if (result.success) {
    assert.equal(result.data.jobTitle, "Software Engineer");
    assert.equal(result.data.company, "");
  }
});
