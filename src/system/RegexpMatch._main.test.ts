import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "../behaviors";
import { RegexpMatch } from "./RegexpMatch";

test("RegexpMatch._main.test", () => {
  const urlSrc = new Of<string>("http://domain.com/some/url/");
  const matchedSrc = new Path(
    new RegexpMatch(new Of("/(s\\w+)/"), urlSrc),
    new Of("0"),
  );
  const g = vi.fn();
  matchedSrc.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("/some/");
});
