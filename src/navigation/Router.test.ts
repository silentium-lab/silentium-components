import { Applied, From, Late, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router.test", () => {
  const urlSrc = new Late<string>("http://domain.com/");
  const urlPathSrc = new Shared(new Applied(urlSrc, drop("http://domain.com")));
  const g = vi.fn();
  urlPathSrc.value(new From(g));

  const routerSrc = new Router(
    urlPathSrc,
    new Of([
      {
        pattern: "^/$",
        template: new Of("page/home.html"),
      },
      {
        pattern: "/some/contacts",
        template: "page/contacts.html",
      },
    ]),
    new Of<string>("page/404.html"),
  );
  const g2 = vi.fn();
  routerSrc.value(new From(g2));

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  urlSrc.owner().give("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  urlSrc.owner().give("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  urlSrc.owner().give("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
