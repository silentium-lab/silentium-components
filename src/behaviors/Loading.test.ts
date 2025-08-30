import { From, Late } from "silentium";
import { expect, test, vi } from "vitest";
import { Loading } from "../behaviors/Loading";

test("Loading.test", () => {
  const loadingStartSource = new Late();
  const loadingFinishSource = new Late();
  const loadingSrc = new Loading(loadingStartSource, loadingFinishSource);
  const g = vi.fn();
  loadingSrc.value(new From(g));
  loadingStartSource.give({});
  expect(g).toHaveBeenLastCalledWith(true);
  loadingFinishSource.give({});
  expect(g).toHaveBeenLastCalledWith(false);
});
