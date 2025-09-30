import { late, of } from "silentium";
import { regexpMatched } from "../system/RegexpMatched";
import { expect, test, vi } from "vitest";

test("RegexpMatched.test", () => {
  const urlI = late<string>("http://domain.com/some/url/");
  const matchedSrc = regexpMatched(of("/some/url"), urlI.value);
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith(true);

  urlI.give("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
