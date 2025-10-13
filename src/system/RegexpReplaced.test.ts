import { Late, Of } from "silentium";
import { regexpReplaced } from "../system/RegexpReplaced";
import { expect, test, vi } from "vitest";

test("RegexpReplaced.test", () => {
  const urlSrc = Late<string>("http://domain.com/some/url/");
  const matchedSrc = regexpReplaced(urlSrc.event, Of("some/url/"), Of(""));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  urlSrc.use("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
