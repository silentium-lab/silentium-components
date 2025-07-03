import { of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { polling } from "./Polling";

test("Polling.test", () => {
  const [src, so] = of<number>(1);
  const [triggerSrc, tso] = of(1);
  const result = ownerSync(polling(src, triggerSrc));

  expect(result.syncValue()).toBe(1);

  so.give(2);

  expect(result.syncValue()).toBe(1);

  tso.give(1);

  expect(result.syncValue()).toBe(2);
});
