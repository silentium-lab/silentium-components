import { From, Late, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Deferred } from "../behaviors/Deferred";
import { Sync } from "./Sync";

test("Deferred.test", () => {
  const urlSrc = new Late<string>("http://hello.com");
  const layoutSrc = new Late<string>();

  const urlWithLayoutSrc = new Shared(new Deferred(urlSrc, layoutSrc));

  const g1 = vi.fn();
  urlWithLayoutSrc.value(new From(g1));
  expect(g1).not.toHaveBeenCalled();

  layoutSrc.owner().give("layout here");

  const g2 = vi.fn();
  urlWithLayoutSrc.value(new From(g2));
  urlSrc.owner().give("http://new.com");
  expect(g2).toHaveBeenCalledWith("http://hello.com");

  const urlSync = new Sync(urlWithLayoutSrc);

  expect(urlSync.valueSync()).toBe("http://hello.com");

  layoutSrc.owner().give("layout here again");

  expect(urlSync.valueSync()).toBe("http://new.com");
});
