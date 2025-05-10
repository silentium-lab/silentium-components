import { sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { not } from "../boolean/Not";

test("Not.test", () => {
  const one = sourceOf<boolean>(false);
  const result = sourceSync(not(one));
  expect(result.syncValue()).toBe(true);

  one.give(true);
  expect(result.syncValue()).toBe(false);
});
