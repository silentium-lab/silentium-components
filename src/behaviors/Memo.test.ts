import { Late, Shared } from "silentium";
import { Memo } from "../behaviors/Memo";
import { expect, test, vi } from "vitest";

test("Memo.test", () => {
  const l = Late<number>(1);
  const mem = Shared(Memo(l.event));
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
