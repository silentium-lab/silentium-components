import { I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { regexpReplaced } from "../system/RegexpReplaced";

test("RegexpReplaced.test", () => {
  const [urlSrc, urlO] = of<string>("http://domain.com/some/url/");
  const matchedSrc = ownerSync(regexpReplaced(urlSrc, I("some/url/"), I("")));

  expect(matchedSrc.syncValue()).toBe("http://domain.com/");

  urlO.give("http://domain.com/some/url/changed/");

  expect(matchedSrc.syncValue()).toBe("http://domain.com/changed/");
});
