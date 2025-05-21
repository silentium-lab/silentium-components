import { sourceOf, value } from "silentium";
import { onlyChanged } from "../behaviors/OnlyChanged";
import { expect, test, vi } from "vitest";

test("OnlyChanged.test", () => {
  const src = sourceOf<number>(1);
  const changedSrc = onlyChanged(src);

  const g = vi.fn();
  value(changedSrc, g);
  expect(g).not.toBeCalled();

  src.give(2);

  const g2 = vi.fn();
  value(changedSrc, g2);
  expect(g2).toBeCalledWith(2);
});
