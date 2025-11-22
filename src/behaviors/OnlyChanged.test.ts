import { Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";

import { OnlyChanged } from "../behaviors/OnlyChanged";

test("OnlyChanged.test", () => {
  const src = Late<number>(1);
  const changedSrc = Shared(OnlyChanged(src));

  const g = vi.fn();
  changedSrc.then(g);
  expect(g).not.toBeCalled();

  src.use(2);

  const g2 = vi.fn();
  changedSrc.then(g2);
  expect(g2).toBeCalledWith(2);
});
