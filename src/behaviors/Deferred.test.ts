import { Late, Primitive, Shared } from "silentium";
import { deferred } from "../behaviors/Deferred";
import { expect, test, vi } from "vitest";

test("Deferred.test", () => {
  const urlSrc = Late<string>("http://hello.com");
  const layoutSrc = Late<string>();

  const urlWithLayoutSrc = Shared(deferred(urlSrc.event, layoutSrc.event));

  const g1 = vi.fn();
  urlWithLayoutSrc.event(g1);
  expect(g1).not.toHaveBeenCalled();

  layoutSrc.use("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc.event(g2);
  urlSrc.use("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = Primitive(urlWithLayoutSrc.event);

  expect(urlSync.primitive()).toBe("http://hello.com");

  layoutSrc.use("layout here again");

  expect(urlSync.primitive()).toBe("http://new.com");
});
