import { sourceOf, sourceSync } from "silentium";
import { and } from "./And";
import { expect, test } from "vitest";

test("And.test", () => {
  const one = sourceOf<boolean>(false);
  const two = sourceOf<boolean>(false);
  const result = sourceSync(and(one, two));
  expect(result.syncValue()).toBe(false);

  one.give(true);
  two.give(false);
  expect(result.syncValue()).toBe(false);

  one.give(false);
  two.give(true);
  expect(result.syncValue()).toBe(false);

  one.give(true);
  two.give(true);
  expect(result.syncValue()).toBe(true);
});
