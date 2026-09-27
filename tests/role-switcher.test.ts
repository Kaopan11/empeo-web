import assert from "node:assert/strict";
import test from "node:test";
import { actorById, selectActor } from "../src/lib/role-switcher.ts";

const store = new Map<string, string>();
globalThis.localStorage = {
  getItem: (key) => store.get(key) ?? null,
  setItem: (key, value) => {
    store.set(key, value);
  },
  removeItem: (key) => {
    store.delete(key);
  },
  clear: () => store.clear(),
  key: () => null,
  length: 0,
};

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
