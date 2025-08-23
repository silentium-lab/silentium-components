import { From, Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { OnlyChanged } from "../behaviors/OnlyChanged";

test("OnlyChanged.test", () => {
  const src = new Late<number>(1);
  const changedSrc = new Shared(new OnlyChanged(src));

  const g = vi.fn();
  changedSrc.value(new From(g));
  expect(g).not.toBeCalled();

  src.owner().give(2);

  const g2 = vi.fn();
  changedSrc.value(new From(g2));
  expect(g2).toBeCalledWith(2);
});
