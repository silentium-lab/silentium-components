import { sourceOf, sourceSync, value } from "silentium";
import { deferred } from "../behaviors/Deferred";
import { expect, test, vi } from "vitest";

test("Deferred.test", () => {
  const urlSrc = sourceOf<string>("http://hello.com");
  const layoutSrc = sourceOf();

  const urlWithLayoutSrc = sourceSync(deferred(urlSrc, layoutSrc));

  const g1 = vi.fn();
  value(urlWithLayoutSrc, g1);
  expect(g1).not.toHaveBeenCalled();

  layoutSrc.give("layout here");

  const g2 = vi.fn();
  value(urlWithLayoutSrc, g2);
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  urlSrc.give("http://new.com");

  expect(urlWithLayoutSrc.syncValue()).toBe("http://hello.com");

  layoutSrc.give("layout here again");

  expect(urlWithLayoutSrc.syncValue()).toBe("http://new.com");
});
