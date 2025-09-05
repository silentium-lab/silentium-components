import { Applied, From, Late, Lazy, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Router } from "./Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router._main.test", () => {
  const urlSrc = new Late<string>("http://domain.com/");
  const urlPathSrc = new Shared(new Applied(urlSrc, drop("http://domain.com")));
  const g = vi.fn();
  urlPathSrc.value(new From(g));

  const routerSrc = new Router(
    urlPathSrc,
    new Of([
      {
        pattern: "^/$",
        template: new Lazy(() => new Of("page/home.html")),
      },
      {
        pattern: "/some/contacts",
        template: new Lazy(() => new Of("page/contacts.html")),
      },
    ]),
    new Lazy(() => new Of<string>("page/404.html")),
  );
  const g2 = vi.fn();
  routerSrc.value(new From(g2));

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  urlSrc.give("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  urlSrc.give("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  urlSrc.give("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
