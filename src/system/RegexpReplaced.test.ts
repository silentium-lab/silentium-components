import { Late, Of, Transport } from "silentium";
import { RegexpReplaced } from "../system/RegexpReplaced";
import { expect, test, vi } from "vitest";

test("RegexpReplaced.test", () => {
  const $url = Late<string>("http://domain.com/some/url/");
  const $matched = RegexpReplaced($url, Of("some/url/"), Of(""));
  const g = vi.fn();
  $matched.to(Transport(g));

  expect(g).toHaveBeenLastCalledWith("http://domain.com/");

  $url.use("http://domain.com/some/url/changed/");

  expect(g).toHaveBeenLastCalledWith("http://domain.com/changed/");
});
