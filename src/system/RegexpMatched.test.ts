import { Late, Of } from "silentium";
import { expect, test, vi } from "vitest";

import { RegexpMatched } from "../system/RegexpMatched";

test("RegexpMatched.test", () => {
  const $url = Late<string>("http://domain.com/some/url/");
  const $matched = RegexpMatched(Of("/some/url"), $url);
  const g = vi.fn();
  $matched.then(g);

  expect(g).toHaveBeenLastCalledWith(true);

  $url.use("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
