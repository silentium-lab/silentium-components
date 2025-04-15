import { SourceSync, SourceWithPool } from "silentium";
import { expect, test } from "vitest";
import { Loading } from "../behaviors/Loading";

test("Loading.test", () => {
  const loadingStartSource = new SourceWithPool();
  const loadingFinishSource = new SourceWithPool();
  const loading = new SourceSync(
    new Loading(loadingStartSource, loadingFinishSource),
  );
  loadingStartSource.give({});
  expect(loading.syncValue()).toBe(true);
  loadingFinishSource.give({});
  expect(loading.syncValue()).toBe(false);
});
