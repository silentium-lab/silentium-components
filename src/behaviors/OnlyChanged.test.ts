import { late, shared } from "silentium";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { expect, test, vi } from "vitest";

test("OnlyChanged.test", () => {
  const src = late<number>(1);
  const changedSrc = shared(onlyChanged(src.event));

  const g = vi.fn();
  changedSrc.event(g);
  expect(g).not.toBeCalled();

  src.use(2);

  const g2 = vi.fn();
  changedSrc.event(g2);
  expect(g2).toBeCalledWith(2);
});
