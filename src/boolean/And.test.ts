import { of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { and } from "../boolean/And";

test("And.test", () => {
  const [one, oo] = of<boolean>(false);
  const [two, to] = of<boolean>(false);
  const result = ownerSync(and(one, two));
  expect(result.syncValue()).toBe(false);

  oo.give(true);
  to.give(false);
  expect(result.syncValue()).toBe(false);

  oo.give(false);
  to.give(true);
  expect(result.syncValue()).toBe(false);

  oo.give(true);
  to.give(true);
  expect(result.syncValue()).toBe(true);
});
