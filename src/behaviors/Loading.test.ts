import { Late } from "silentium";
import { expect, test, vi } from "vitest";

import { Loading } from "../behaviors/Loading";

test("Loading.test", () => {
  const $loadingStart = Late();
  const $loadingFinish = Late();
  const $loading = Loading($loadingStart, $loadingFinish);
  const g = vi.fn();
  $loading.then(g);
  $loadingStart.use({});
  expect(g).toHaveBeenLastCalledWith(true);
  $loadingFinish.use({});
  expect(g).toHaveBeenLastCalledWith(false);
});
