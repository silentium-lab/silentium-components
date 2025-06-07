import { sourceOf, sourceResettable, sourceSync } from "silentium";
import { priority } from "../behaviors/Priority";
import { expect, test } from "vitest";

test("Priority.test", () => {
  const src1 = sourceOf();
  const src2Reset = sourceOf();
  const src2 = sourceResettable<number>(2, src2Reset);
  const resetSrc = sourceOf();

  const prioritySrc = sourceSync(priority([src1, src2], resetSrc));

  src1.give(1);
  src2.give(2);

  expect(prioritySrc.syncValue()).toBe(2);

  src1.give(3);

  expect(prioritySrc.syncValue()).toBe(2);

  src2.give(4);

  expect(prioritySrc.syncValue()).toBe(4);

  src2Reset.give(1);
  resetSrc.give(1);

  expect(prioritySrc.syncValue()).toBe(3);
});
