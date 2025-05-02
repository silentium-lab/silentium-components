import { source, sourceApplied, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router.test", () => {
  const urlSrc = sourceOf<string>("http://domain.com/some/url/");
  const urlClearedSrc = sourceApplied(urlSrc, drop("http://domain.com"));

  const template = sourceSync(
    router(
      urlClearedSrc,
      [
        {
          pattern: "^/$",
          template: source("page/home.html"),
        },
        {
          pattern: "/some/url",
          template: "page/home.html",
        },
        {
          pattern: "/some/contacts",
          template: "page/contacts.html",
        },
      ],
      source("page/404.html"),
    ),
  );

  expect(template.syncValue()).toBe("page/home.html");

  urlSrc.give("http://domain.com/some/contacts/");

  expect(template.syncValue()).toBe("page/contacts.html");

  urlSrc.give("http://domain.com/some/unknown/");

  expect(template.syncValue()).toBe("page/404.html");

  urlSrc.give("http://domain.com/");

  expect(template.syncValue()).toBe("page/home.html");
});
