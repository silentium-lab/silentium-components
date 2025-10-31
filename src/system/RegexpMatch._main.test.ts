import { Of, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "../behaviors";
import { RegexpMatch } from "./RegexpMatch";

test("RegexpMatch._main.test", () => {
  const $url = Of<string>("http://domain.com/some/url/");
  const $matched = Path(RegexpMatch(Of("/(s\\w+)/"), $url), Of("0"));
  const g = vi.fn();
  $matched.event(Transport(g));

  expect(g).toHaveBeenLastCalledWith("/some/");
});
