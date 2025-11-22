import { Late, Of } from "silentium";
import { expect, test, vi } from "vitest";

import { RegexpReplaced } from "../system/RegexpReplaced";

test("RegexpReplaced.test", () => {
  const $url = Late<string>("http://domain.com/some/url/");
  const $matched = RegexpReplaced($url, Of("some/url/"), Of(""));
  const g = vi.fn();
  $matched.then(g);

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  $url.use("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
