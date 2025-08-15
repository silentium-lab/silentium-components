import { of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { memo } from "../behaviors/Memo";

test("Memo.test", () => {
  const [src, so] = of<number>(1);
  const [mem] = shared(memo(src));
  const g = vi.fn();
  mem(g);
  let counter = 0;

  mem(() => {
    counter += 1;
  });

  so(2);
  so(2);
  so(2);
  so(2);
  so(2);

  expect(g).toHaveBeenLastCalledWith(2);
  expect(counter).toBe(2);

  so(3);

  expect(g).toHaveBeenLastCalledWith(3);
  expect(counter).toBe(3);
});
