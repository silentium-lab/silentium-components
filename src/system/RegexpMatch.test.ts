import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "../behaviors";
import { regexpMatch } from "../system/RegexpMatch";

test("RegexpMatch.test", () => {
  const urlSrc = I<string>("http://domain.com/some/url/");
  const matchedSrc = ownerSync(
    path(regexpMatch(I("/(s\\w+)/"), urlSrc), I("0")),
  );

  expect(matchedSrc.syncValue()).toBe("/some/");
});
