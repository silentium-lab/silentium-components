import { O, of, pool } from "silentium";
import { expect, test, vi } from "vitest";
import { onlyChanged } from "../behaviors/OnlyChanged";

test("OnlyChanged.test", () => {
  const [src, so] = of<number>(1);
  const [changedSrc] = pool(onlyChanged(src));

  const g = vi.fn();
  changedSrc.value(O(g));
  expect(g).not.toBeCalled();

  so.give(2);

  const g2 = vi.fn();
  changedSrc.value(O(g2));
  expect(g2).toBeCalledWith(2);
});
