import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { loading } from "../behaviors/Loading";

test("Loading.test", () => {
  const [loadingStartSource, lso] = of();
  const [loadingFinishSource, lfo] = of();
  const loadingSrc = loading(loadingStartSource, loadingFinishSource);
  const g = vi.fn();
  loadingSrc(g);
  lso({});
  expect(g).toHaveBeenLastCalledWith(true);
  lfo({});
  expect(g).toHaveBeenLastCalledWith(false);
});
