import { sourceOf, sourceSync } from "silentium";
import { regexpMatched } from "../system/RegexpMatched";
import { expect, test } from "vitest";

test("RegexpMatched.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");
  const matchedSrc = sourceSync(regexpMatched("/some/url", urlSrc));

  expect(matchedSrc.syncValue()).toBe(true);

  urlSrc.give("http://domain.com/changed");

  expect(matchedSrc.syncValue()).toBe(false);
});
