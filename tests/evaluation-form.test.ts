import assert from "node:assert/strict";
import test from "node:test";
import { evaluationSchema, draftEvaluationSchema, isLenient } from "../src/lib/evaluation-form.ts";

test("5 and 5 is lenient and needs feedback", () => {
  assert.equal(isLenient({ technical: "5", collaboration: "5" }), true);
  const parsed = evaluationSchema.safeParse({
    technical: "5",
    collaboration: "5",
    feedback: "  ",
  });
  assert.equal(parsed.success, false);
});

test("5 with 4 or lower on the other criterion is not lenient", () => {
  assert.equal(isLenient({ technical: "5", collaboration: "4" }), false);
  assert.equal(isLenient({ technical: "4", collaboration: "4" }), false);
  const parsed = evaluationSchema.safeParse({
    technical: "5",
    collaboration: "4",
    feedback: "",
  });
  assert.equal(parsed.success, true);
});

test("draft save allows empty feedback with 1-5 ratings", () => {
  const parsed = draftEvaluationSchema.safeParse({
    technical: "3",
    collaboration: "2",
    feedback: "",
  });
  assert.equal(parsed.success, true);
});

test("scores of 3 and below do not require feedback", () => {
  assert.equal(isLenient({ technical: "3", collaboration: "2" }), false);
  const parsed = evaluationSchema.safeParse({
    technical: "3",
    collaboration: "2",
    feedback: "",
  });
  assert.equal(parsed.success, true);
});
