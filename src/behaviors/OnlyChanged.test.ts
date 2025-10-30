import { Late, Shared, Transport } from "silentium";
import { OnlyChanged } from "../behaviors/OnlyChanged";
import { expect, test, vi } from "vitest";

test("OnlyChanged.test", () => {
  const src = Late<number>(1);
  const changedSrc = Shared(OnlyChanged(src));

  const g = vi.fn();
  changedSrc.event(Transport(g));
  expect(g).not.toBeCalled();

  src.use(2);

  const g2 = vi.fn();
  changedSrc.event(Transport(g2));
  expect(g2).toBeCalledWith(2);
});
