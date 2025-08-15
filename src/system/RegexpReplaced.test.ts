import { i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { regexpReplaced } from "../system/RegexpReplaced";

test("RegexpReplaced.test", () => {
  const [urlSrc, urlO] = of<string>("http://domain.com/some/url/");
  const matchedSrc = regexpReplaced(urlSrc, i("some/url/"), i(""));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  urlO("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
