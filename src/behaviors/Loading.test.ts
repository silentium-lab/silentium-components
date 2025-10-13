import { Late } from "silentium";
import { loading } from "../behaviors/Loading";
import { expect, test, vi } from "vitest";

test("Loading.test", () => {
  const loadingStartSource = Late();
  const loadingFinishSource = Late();
  const loadingSrc = loading(
    loadingStartSource.event,
    loadingFinishSource.event,
  );
  const g = vi.fn();
  loadingSrc(g);
  loadingStartSource.use({});
  expect(g).toHaveBeenLastCalledWith(true);
  loadingFinishSource.use({});
  expect(g).toHaveBeenLastCalledWith(false);
});
