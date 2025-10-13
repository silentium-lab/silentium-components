import { Late, Of } from "silentium";
import { regexpMatched } from "../system/RegexpMatched";
import { expect, test, vi } from "vitest";

test("RegexpMatched.test", () => {
  const urlI = Late<string>("http://domain.com/some/url/");
  const matchedSrc = regexpMatched(Of("/some/url"), urlI.event);
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith(true);

  urlI.use("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
