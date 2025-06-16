import { source, sourceApplied, sourceOf, sourceSync } from "silentium";
import { expect, test, vi } from "vitest";
import { router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/");
  const urlPathSrc = sourceApplied(urlSrc, drop("http://domain.com"));
  const urlPathSync = sourceSync(urlPathSrc);

  const responseSrc = sourceSync(
    router(
      urlPathSrc,
      [
        {
          pattern: "^/$",
          template: source("page/home.html"),
        },
        {
          pattern: "/some/contacts",
          template: "page/contacts.html",
        },
      ],
      source("page/404.html"),
    ),
  );

  const g1 = vi.fn();
  responseSrc.value(g1);
  expect(g1).toBeCalledWith("page/home.html");

  urlSrc.give("http://domain.com/some/contacts");

  expect(urlPathSync.syncValue()).toBe("/some/contacts");
  const g2 = vi.fn();
  responseSrc.value(g2);
  expect(g2).toBeCalledWith("page/contacts.html");

  urlSrc.give("http://domain.com/some/unknown/");

  expect(responseSrc.syncValue()).toBe("page/404.html");

  urlSrc.give("http://domain.com/");

  expect(responseSrc.syncValue()).toBe("page/home.html");
});
