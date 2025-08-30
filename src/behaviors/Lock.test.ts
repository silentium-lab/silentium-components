import { From, Late, Shared } from "silentium";
import { Lock } from "../behaviors/Lock";
import { expect, test, vi } from "vitest";

test("Lock.test", () => {
  const source = new Late<number>(1);
  const lockSrc = new Late<boolean>(false);

  const ls = new Lock(source, lockSrc);
  const lockedSrc = new Shared(ls);
  const g = vi.fn();
  lockedSrc.value(new From(g));

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
