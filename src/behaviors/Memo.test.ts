import { patron, sourceOf, sourceSync, value } from "silentium";
import { memo } from "../behaviors/Memo";
import { expect, test } from "vitest";

test("Memo.test", () => {
  const src = sourceOf<number>(1);
  const srcMemo = sourceSync(memo(src));
  let counter = 0;
  value(
    srcMemo,
    patron(() => {
      counter += 1;
    }),
  );

  src.give(2);
  src.give(2);
  src.give(2);
  src.give(2);
  src.give(2);

  expect(srcMemo.syncValue()).toBe(2);
  expect(counter).toBe(2);
});
