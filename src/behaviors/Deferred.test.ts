import { O, of, ownerSync, pool } from "silentium";
import { expect, test, vi } from "vitest";
import { deferred } from "../behaviors/Deferred";

test("Deferred.test", () => {
  const [urlSrc, uo] = of<string>("http://hello.com");
  const [layoutSrc, lo] = of<string>();

  const [urlWithLayoutSrc] = pool(deferred(urlSrc, layoutSrc));

  const g1 = vi.fn();
  urlWithLayoutSrc.value(O(g1));
  expect(g1).not.toHaveBeenCalled();

  lo.give("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc.value(O(g2));
  uo.give("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = ownerSync(urlWithLayoutSrc);

  expect(urlSync.syncValue()).toBe("http://hello.com");

  lo.give("layout here again");

  expect(urlSync.syncValue()).toBe("http://new.com");
});
