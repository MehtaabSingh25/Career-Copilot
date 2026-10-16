import test from "node:test";
import assert from "node:assert/strict";
import {
  tailorResumeSchema,
  tailoredResumeResponseSchema,
} from "../src/modules/ai/tailor.validator.js";

const validJobDescription = "We are looking for a developer to build web applications, collaborate with product and design teams, review code, write tests, and maintain reliable services using modern JavaScript and TypeScript.";

const validDraft = {
  professionalSummary: "Developer experienced in building web applications.",
  skills: ["JavaScript", "TypeScript"],
  experienceBullets: ["Built and maintained web applications."],
  projectBullets: [],
  keywords: ["TypeScript"],
  changeNotes: ["Prioritized relevant development experience."],
  cautions: ["The resume does not document cloud deployment experience."],
};

test("tailorResumeSchema accepts a valid job description", () => {
  assert.equal(tailorResumeSchema.safeParse({ jobDescription: validJobDescription }).success, true);
});

test("tailorResumeSchema rejects a job description shorter than 100 characters", () => {
  assert.equal(tailorResumeSchema.safeParse({ jobDescription: "Developer wanted." }).success, false);
});

test("tailorResumeSchema rejects a job description longer than 20,000 characters", () => {
  assert.equal(tailorResumeSchema.safeParse({ jobDescription: "x".repeat(20001) }).success, false);
});

test("tailorResumeSchema trims the job description", () => {
  const result = tailorResumeSchema.safeParse({ jobDescription: `  ${validJobDescription}  ` });
  assert.equal(result.success, true);
  if (result.success) assert.equal(result.data.jobDescription, validJobDescription);
});

test("tailoredResumeResponseSchema accepts a complete draft", () => {
  assert.equal(tailoredResumeResponseSchema.safeParse(validDraft).success, true);
});

test("tailoredResumeResponseSchema rejects malformed AI output", () => {
  assert.equal(tailoredResumeResponseSchema.safeParse({ ...validDraft, skills: "TypeScript" }).success, false);
});
