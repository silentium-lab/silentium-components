import { sourceOf, sourceSync } from "silentium";
import { regexpReplaced } from "../system/RegexpReplaced";
import { expect, test } from "vitest";

test("RegexpReplaced.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");
  const matchedSrc = sourceSync(regexpReplaced(urlSrc, "some/url/", ""));

  expect(matchedSrc.syncValue()).toBe("http://domain.com/");

  urlSrc.give("http://domain.com/some/url/changed/");

  expect(matchedSrc.syncValue()).toBe("http://domain.com/changed/");
});
