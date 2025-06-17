import { sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { polling } from "./Polling";

test("Polling.test", () => {
  const src = sourceOf<number>(1);
  const triggerSrc = sourceOf(1);
  const serveyResult = sourceSync(polling(src, triggerSrc));

  expect(serveyResult.syncValue()).toBe(1);

  src.give(2);

  expect(serveyResult.syncValue()).toBe(1);

  triggerSrc.give(1);

  expect(serveyResult.syncValue()).toBe(2);
});
