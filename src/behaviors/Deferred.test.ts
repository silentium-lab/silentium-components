import { of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { deferred } from "../behaviors/Deferred";
import { sync } from "./Sync";

test("Deferred.test", () => {
  const [urlSrc, uo] = of<string>("http://hello.com");
  const [layoutSrc, lo] = of<string>();

  const [urlWithLayoutSrc] = shared(deferred(urlSrc, layoutSrc));

  const g1 = vi.fn();
  urlWithLayoutSrc(g1);
  expect(g1).not.toHaveBeenCalled();

  lo("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc(g2);
  uo("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = sync(urlWithLayoutSrc);

  expect(urlSync.value()).toBe("http://hello.com");

  lo("layout here again");

  expect(urlSync.value()).toBe("http://new.com");
});
