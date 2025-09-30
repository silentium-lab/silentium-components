import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "../behaviors";
import { regexpMatch } from "./RegexpMatch";

test("RegexpMatch._group.test", () => {
  const urlSrc = of<string>("http://domain.com/some/url/");
  const matchedSrc = path(regexpMatch(of("/(s\\w+)/"), urlSrc), of("1"));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("some");
});
