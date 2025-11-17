import { Late, Primitive, Shared, Tap } from "silentium";
import { Deferred } from "../behaviors/Deferred";
import { expect, test, vi } from "vitest";

test("Deferred.test", () => {
  const $url = Late<string>("http://hello.com");
  const $layout = Late<string>();

  const urlWithLayoutSrc = Shared(Deferred($url, $layout));

  const g1 = vi.fn();
  urlWithLayoutSrc.pipe(Tap(g1));
  expect(g1).not.toHaveBeenCalled();

  $layout.use("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc.pipe(Tap(g2));
  $url.use("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = Primitive(urlWithLayoutSrc);

  expect(urlSync.primitive()).toBe("http://hello.com");

  $layout.use("layout here again");

  expect(urlSync.primitive()).toBe("http://new.com");
});
