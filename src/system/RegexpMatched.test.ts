import { Late, Of, Tap } from "silentium";
import { RegexpMatched } from "../system/RegexpMatched";
import { expect, test, vi } from "vitest";

test("RegexpMatched.test", () => {
  const $url = Late<string>("http://domain.com/some/url/");
  const $matched = RegexpMatched(Of("/some/url"), $url);
  const g = vi.fn();
  $matched.pipe(Tap(g));

  expect(g).toHaveBeenLastCalledWith(true);

  $url.use("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
