import { O, of, ownerSync, pool } from "silentium";
import { expect, test } from "vitest";
import { memo } from "../behaviors/Memo";

test("Memo.test", () => {
  const [src, so] = of<number>(1);
  const [mem] = pool(memo(src));
  const srcMemo = ownerSync(mem);
  let counter = 0;

  mem.value(
    O(() => {
      counter += 1;
    }),
  );

  so.give(2);
  so.give(2);
  so.give(2);
  so.give(2);
  so.give(2);

  expect(srcMemo.syncValue()).toBe(2);
  expect(counter).toBe(2);

  so.give(3);

  expect(srcMemo.syncValue()).toBe(3);
  expect(counter).toBe(3);
});
