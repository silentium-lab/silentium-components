import { From, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RegexpMatched } from "../system/RegexpMatched";

test("RegexpMatched.test", () => {
  const urlI = new Late<string>("http://domain.com/some/url/");
  const matchedSrc = new RegexpMatched(new Of("/some/url"), urlI);
  const g = vi.fn();
  matchedSrc.value(new From(g));

  expect(g).toHaveBeenLastCalledWith(true);

  urlI.owner().give("http://domain.com/changed");

  expect(g).toHaveBeenLastCalledWith(false);
});
