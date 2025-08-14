import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "../behaviors";
import { regexpMatch } from "./RegexpMatch";

test("RegexpMatch._group.test", () => {
  const urlSrc = i<string>("http://domain.com/some/url/");
  const matchedSrc = path(regexpMatch(i("/(s\\w+)/"), urlSrc), i("1"));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("some");
});
