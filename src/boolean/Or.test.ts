import { sourceOf, sourceSync } from "silentium";
import { or } from "../boolean/Or";
import { expect, test } from "vitest";

test("Or.test", () => {
  const one = sourceOf<boolean>(false);
  const two = sourceOf<boolean>(false);
  const result = sourceSync(or(one, two));
  expect(result.syncValue()).toBe(false);

  one.give(true);
  two.give(false);
  expect(result.syncValue()).toBe(true);

  one.give(false);
  two.give(true);
  expect(result.syncValue()).toBe(true);

  one.give(true);
  two.give(true);
  expect(result.syncValue()).toBe(true);
});
