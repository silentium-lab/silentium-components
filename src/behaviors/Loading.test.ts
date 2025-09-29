import { late } from "silentium";
import { loading } from "../behaviors/Loading";
import { expect, test, vi } from "vitest";

test("Loading.test", () => {
  const loadingStartSource = late();
  const loadingFinishSource = late();
  const loadingSrc = loading(
    loadingStartSource.value,
    loadingFinishSource.value,
  );
  const g = vi.fn();
  loadingSrc(g);
  loadingStartSource.give({});
  expect(g).toHaveBeenLastCalledWith(true);
  loadingFinishSource.give({});
  expect(g).toHaveBeenLastCalledWith(false);
});
