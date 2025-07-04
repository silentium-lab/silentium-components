import { of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { not } from "../boolean/Not";

test("Not.test", () => {
  const [one, oo] = of<boolean>(false);
  const result = ownerSync(not(one));
  expect(result.syncValue()).toBe(true);

  oo.give(true);
  expect(result.syncValue()).toBe(false);
});
