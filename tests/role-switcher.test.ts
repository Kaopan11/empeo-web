import assert from "node:assert/strict";
import test from "node:test";
import { actorById, selectActor } from "../src/lib/role-switcher.ts";

test("unknown id falls back to Nicha", () => {
  assert.equal(actorById("nope").name, "Nicha");
  assert.equal(selectActor("nope").id, "a1000000-0000-4000-8000-000000000001");
});

test("known id selects that person", () => {
  assert.equal(
    selectActor("a1000000-0000-4000-8000-000000000011").initials,
    "AL",
  );
});
