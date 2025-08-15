import { of, sharedStateless } from "silentium";
import { expect, test, vi } from "vitest";
import { lock } from "../behaviors/Lock";

test("Lock.test", () => {
  const [source, so] = of<number>(1);
  const [lockSrc, lo] = of<boolean>(false);

  const ls = lock(source, lockSrc);
  const [lockedSrc] = sharedStateless(ls);
  const g = vi.fn();
  lockedSrc(g);

  expect(g).toHaveBeenLastCalledWith(1);

  so(2);

  expect(g).toHaveBeenLastCalledWith(2);

  lo(true);
  so(3);
  so(4);
  so(5);

  expect(g).toHaveBeenLastCalledWith(2);

  lo(false);
  so(6);
  expect(g).toHaveBeenLastCalledWith(6);
});
