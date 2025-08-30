import { From, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RegexpReplaced } from "../system/RegexpReplaced";

test("RegexpReplaced.test", () => {
  const urlSrc = new Late<string>("http://domain.com/some/url/");
  const matchedSrc = new RegexpReplaced(
    urlSrc,
    new Of("some/url/"),
    new Of(""),
  );
  const g = vi.fn();
  matchedSrc.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  urlSrc.give("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
