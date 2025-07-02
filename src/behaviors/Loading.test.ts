import { of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { loading } from "../behaviors/Loading";

test("Loading.test", () => {
  const [loadingStartSource, lso] = of();
  const [loadingFinishSource, lfo] = of();
  const loadingSrc = ownerSync(
    loading(loadingStartSource, loadingFinishSource),
  );
  lso.give({});
  expect(loadingSrc.syncValue()).toBe(true);
  lfo.give({});
  expect(loadingSrc.syncValue()).toBe(false);
});
