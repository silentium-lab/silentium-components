import { sourceOf, sourceSync } from "silentium";
import { regexpMatch } from "./RegexpMatch";
import { expect, test } from "vitest";
import { path } from "../behaviors";

test("RegexpMatch._group.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");
  const matchedSrc = sourceSync(path(regexpMatch("/(s\\w+)/", urlSrc), "1"));

  expect(matchedSrc.syncValue()).toBe("some");
});
