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

  source.owner().give(2);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.owner().give(true);
  source.owner().give(3);
  source.owner().give(4);
  source.owner().give(5);

  expect(g).toHaveBeenLastCalledWith(2);

  lockSrc.owner().give(false);
  source.owner().give(6);
  expect(g).toHaveBeenLastCalledWith(6);
});
