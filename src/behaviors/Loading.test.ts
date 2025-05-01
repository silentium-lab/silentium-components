import { sourceOf, sourceSync } from "silentium";
import { loading } from "../behaviors/Loading";
import { expect, test } from "vitest";

test("Loading.test", () => {
  const loadingStartSource = sourceOf();
  const loadingFinishSource = sourceOf();
  const loadingSrc = sourceSync(
    loading(loadingStartSource, loadingFinishSource),
  );
  loadingStartSource.give({});
  expect(loadingSrc.syncValue()).toBe(true);
  loadingFinishSource.give({});
  expect(loadingSrc.syncValue()).toBe(false);
});
