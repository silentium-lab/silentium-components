import { late, shared } from "silentium";
import { memo } from "../behaviors/Memo";
import { expect, test, vi } from "vitest";

test("Memo.test", () => {
  const l = late<number>(1);
  const mem = shared(memo(l.event));
  const g = vi.fn();
  mem.event(g);
  let counter = 0;

  mem.event(() => {
    counter += 1;
  });

  l.use(2);
  l.use(2);
  l.use(2);
  l.use(2);
  l.use(2);

  expect(g).toHaveBeenLastCalledWith(2);
  expect(counter).toBe(2);

  l.use(3);

  expect(g).toHaveBeenLastCalledWith(3);
  expect(counter).toBe(3);
});
