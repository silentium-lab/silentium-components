import { late, shared } from "silentium";
import { lock } from "../behaviors/Lock";
import { expect, test, vi } from "vitest";

test("Lock.test", () => {
  const source = late<number>(1);
  const lockSrc = late<boolean>(false);

  const ls = lock(source.value, lockSrc.value);
  const lockedSrc = shared(ls);
  const g = vi.fn();
  lockedSrc.value(g);

  expect(g).toHaveBeenLastCalledWith(1);

  source.give(2);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.give(true);
  source.give(3);
  source.give(4);
  source.give(5);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.give(false);
  source.give(6);
  expect(g).toHaveBeenLastCalledWith(6);
});
