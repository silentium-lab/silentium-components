import { Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";

import { Lock } from "../behaviors/Lock";

test("Lock.test", () => {
  const source = Late<number>(1);
  const lockSrc = Late<boolean>(false);

  const ls = Lock(source, lockSrc);
  const lockedSrc = Shared(ls);
  const g = vi.fn();
  lockedSrc.then(g);

  expect(g).toHaveBeenLastCalledWith(1);

  source.use(2);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.use(true);
  source.use(3);
  source.use(4);
  source.use(5);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.use(false);
  source.use(6);
  expect(g).toHaveBeenLastCalledWith(6);
});
