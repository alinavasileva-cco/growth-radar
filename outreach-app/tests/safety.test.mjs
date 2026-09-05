import test from "node:test";
import assert from "node:assert/strict";

const hasPlaceholder = (text) => /\[[^\]]+\]|{{[^}]+}}/.test(text);

test("blocks unresolved variables", () => {
  assert.equal(hasPlaceholder("Здравствуйте, [Имя]."), true);
  assert.equal(hasPlaceholder("Здравствуйте, Анна."), false);
});

test("validates email shape", () => {
  const pattern = /^\S+@\S+\.\S+$/;
  assert.equal(pattern.test("contact@example.com"), true);
  assert.equal(pattern.test("wrong"), false);
});
