import { Of, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "../behaviors";
import { RegexpMatch } from "./RegexpMatch";

test("RegexpMatch._group.test", () => {
  const $url = Of<string>("http://domain.com/some/url/");
  const $matched = Path(RegexpMatch(Of("/(s\\w+)/"), $url), Of("1"));
  const g = vi.fn();
  $matched.pipe(Tap(g));

  expect(g).toHaveBeenLastCalledWith("some");
});
