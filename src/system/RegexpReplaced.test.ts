import { late, of } from "silentium";
import { regexpReplaced } from "../system/RegexpReplaced";
import { expect, test, vi } from "vitest";

test("RegexpReplaced.test", () => {
  const urlSrc = late<string>("http://domain.com/some/url/");
  const matchedSrc = regexpReplaced(urlSrc.value, of("some/url/"), of(""));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  urlSrc.give("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
