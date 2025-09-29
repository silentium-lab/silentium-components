import { late, shared } from "silentium";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { expect, test, vi } from "vitest";

test("OnlyChanged.test", () => {
  const src = late<number>(1);
  const changedSrc = shared(onlyChanged(src.value));

  const g = vi.fn();
  changedSrc.value(g);
  expect(g).not.toBeCalled();

  src.give(2);

  const g2 = vi.fn();
  changedSrc.value(g2);
  expect(g2).toBeCalledWith(2);
});
