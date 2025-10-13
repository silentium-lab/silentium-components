import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "../behaviors";
import { RegexpMatch } from "./RegexpMatch";

test("RegexpMatch._group.test", () => {
  const urlSrc = Of<string>("http://domain.com/some/url/");
  const matchedSrc = Path(RegexpMatch(Of("/(s\\w+)/"), urlSrc), Of("1"));
  const g = vi.fn();
  matchedSrc(g);

  expect(g).toHaveBeenLastCalledWith("some");
});
