import { i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { regexpMatched } from "../system/RegexpMatched";

test("RegexpMatched.test", () => {
  const [urlI, urlO] = of<string>("http://domain.com/some/url/");
  const matchedSrc = regexpMatched(i("/some/url"), urlI);
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith(true);

  urlO("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
