import { I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { regexpMatched } from "../system/RegexpMatched";

test("RegexpMatched.test", () => {
  const [urlI, urlO] = of<string>("http://domain.com/some/url/");
  const matchedSrc = ownerSync(regexpMatched(I("/some/url"), urlI));

  expect(matchedSrc.syncValue()).toBe(true);

  urlO.give("http://domain.com/changed");

  expect(matchedSrc.syncValue()).toBe(false);
});
