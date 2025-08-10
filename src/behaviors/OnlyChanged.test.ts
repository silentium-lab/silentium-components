import { of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { onlyChanged } from "../behaviors/OnlyChanged";

test("OnlyChanged.test", () => {
  const [src, so] = of<number>(1);
  const [changedSrc] = shared(onlyChanged(src));

  const g = vi.fn();
  changedSrc(g);
  expect(g).not.toBeCalled();

  so(2);

  const g2 = vi.fn();
  changedSrc(g2);
  expect(g2).toBeCalledWith(2);
});
