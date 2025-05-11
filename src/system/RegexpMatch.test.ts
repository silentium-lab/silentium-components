import { sourceOf, sourceSync } from "silentium";
import { regexpMatch } from "../system/RegexpMatch";
import { expect, test } from "vitest";
import { path } from "../behaviors";

test("RegexpMatch.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");
  const matchedSrc = sourceSync(path(regexpMatch("/(s\\w+)/", urlSrc), "0"));

  expect(matchedSrc.syncValue()).toBe("/some/");
});
