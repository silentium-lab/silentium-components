import { late, primitive, shared } from "silentium";
import { deferred } from "../behaviors/Deferred";
import { expect, test, vi } from "vitest";

test("Deferred.test", () => {
  const urlSrc = late<string>("http://hello.com");
  const layoutSrc = late<string>();

  const urlWithLayoutSrc = shared(deferred(urlSrc.value, layoutSrc.value));

  const g1 = vi.fn();
  urlWithLayoutSrc.value(g1);
  expect(g1).not.toHaveBeenCalled();

  layoutSrc.give("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc.value(g2);
  urlSrc.give("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = primitive(urlWithLayoutSrc.value);

  expect(urlSync.primitive()).toBe("http://hello.com");

  layoutSrc.give("layout here again");

  expect(urlSync.primitive()).toBe("http://new.com");
});
