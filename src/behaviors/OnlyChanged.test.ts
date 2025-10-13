import { Late, Shared } from "silentium";
import { OnlyChanged } from "../behaviors/OnlyChanged";
import { expect, test, vi } from "vitest";

test("OnlyChanged.test", () => {
  const src = Late<number>(1);
  const changedSrc = Shared(OnlyChanged(src.event));

  const g = vi.fn();
  changedSrc.event(g);
  expect(g).not.toBeCalled();

  src.use(2);

  const g2 = vi.fn();
  changedSrc.event(g2);
  expect(g2).toBeCalledWith(2);
});
