import assert from "node:assert/strict";
import test from "node:test";
import { evaluationSchema, isLenient } from "../src/lib/evaluation-form.ts";

test("a 4 or 5 on either criterion is lenient and needs feedback", () => {
  assert.equal(isLenient({ technical: "4", collaboration: "3" }), true);
  const parsed = evaluationSchema.safeParse({
    technical: "5",
    collaboration: "1",
    feedback: "  ",
  });
  assert.equal(parsed.success, false);
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
