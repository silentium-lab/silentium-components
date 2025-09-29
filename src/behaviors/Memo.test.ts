import { late, shared } from "silentium";
import { memo } from "../behaviors/Memo";
import { expect, test, vi } from "vitest";

test("Memo.test", () => {
  const l = late<number>(1);
  const mem = shared(memo(l.value));
  const g = vi.fn();
  mem.value(g);
  let counter = 0;

  mem.value(() => {
    counter += 1;
  });

  l.give(2);
  l.give(2);
  l.give(2);
  l.give(2);
  l.give(2);

  expect(g).toHaveBeenLastCalledWith(2);
  expect(counter).toBe(2);

  l.give(3);

  expect(g).toHaveBeenLastCalledWith(3);
  expect(counter).toBe(3);
});
