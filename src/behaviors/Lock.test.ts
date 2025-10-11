import { late, shared } from "silentium";
import { lock } from "../behaviors/Lock";
import { expect, test, vi } from "vitest";

test("Lock.test", () => {
  const source = late<number>(1);
  const lockSrc = late<boolean>(false);

  const ls = lock(source.event, lockSrc.event);
  const lockedSrc = shared(ls);
  const g = vi.fn();
  lockedSrc.event(g);

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
