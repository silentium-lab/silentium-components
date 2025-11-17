import { Late, Tap } from "silentium";
import { Loading } from "../behaviors/Loading";
import { expect, test, vi } from "vitest";

test("Loading.test", () => {
  const $loadingStart = Late();
  const $loadingFinish = Late();
  const $loading = Loading($loadingStart, $loadingFinish);
  const g = vi.fn();
  $loading.pipe(Tap(g));
  $loadingStart.use({});
  expect(g).toHaveBeenLastCalledWith(true);
  $loadingFinish.use({});
  expect(g).toHaveBeenLastCalledWith(false);
});
