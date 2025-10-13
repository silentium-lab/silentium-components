import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "../behaviors";
import { regexpMatch } from "./RegexpMatch";

test("RegexpMatch._main.test", () => {
  const urlSrc = Of<string>("http://domain.com/some/url/");
  const matchedSrc = path(regexpMatch(Of("/(s\\w+)/"), urlSrc), Of("0"));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("/some/");
});
