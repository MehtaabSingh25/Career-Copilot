import test from "node:test";
import assert from "node:assert/strict";
import type { IJobRequirement } from "../src/models/JobMatch.js";
import { scoreRequirements } from "../src/modules/jobs/jobs.scoring.js";

const requirement = (
  importance: IJobRequirement["importance"],
  status: IJobRequirement["status"],
): IJobRequirement => ({
  name: "TypeScript",
  importance,
  status,
  evidence: "Used TypeScript in a project",
  explanation: "Evidence found in the resume",
});

test("scoreRequirements returns zero when there are no requirements", () => {
  assert.equal(scoreRequirements([]), 0);
});

test("scoreRequirements returns 100 when every requirement matches", () => {
  assert.equal(scoreRequirements([
    requirement("required", "match"),
    requirement("preferred", "match"),
  ]), 100);
});

test("scoreRequirements returns zero when every requirement is missing", () => {
  assert.equal(scoreRequirements([
    requirement("required", "missing"),
    requirement("preferred", "missing"),
  ]), 0);
});

test("required requirements carry twice the weight of preferred requirements", () => {
  assert.equal(scoreRequirements([
    requirement("required", "missing"),
    requirement("preferred", "match"),
  ]), 33);
});

test("partial matches receive half credit and the final score is rounded", () => {
  assert.equal(scoreRequirements([
    requirement("required", "partial"),
    requirement("preferred", "match"),
  ]), 67);
});
