import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "../behaviors";
import { regexpMatch } from "./RegexpMatch";

test("RegexpMatch._group.test", () => {
  const urlSrc = I<string>("http://domain.com/some/url/");
  const matchedSrc = ownerSync(
    path(regexpMatch(I("/(s\\w+)/"), urlSrc), I("1")),
  );

  expect(matchedSrc.syncValue()).toBe("some");
});
