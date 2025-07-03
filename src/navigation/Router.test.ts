import { applied, I, of, ownerSync, pool } from "silentium";
import { expect, test } from "vitest";
import { router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router.test", () => {
  const [urlSrc, uo] = of<string>("http://domain.com/");
  const [urlPathSrc] = pool(applied(urlSrc, drop("http://domain.com")));
  const urlPathSync = ownerSync(urlPathSrc);

  const responseSrc = ownerSync(
    router(
      urlPathSrc,
      I([
        {
          pattern: "^/$",
          template: I("page/home.html"),
        },
        {
          pattern: "/some/contacts",
          template: "page/contacts.html",
        },
      ]),
      I("page/404.html"),
    ),
  );

  expect(responseSrc.syncValue()).toBe("page/home.html");

  uo.give("http://domain.com/some/contacts");

  expect(urlPathSync.syncValue()).toBe("/some/contacts");
  expect(responseSrc.syncValue()).toBe("page/contacts.html");

  uo.give("http://domain.com/some/unknown/");

  expect(responseSrc.syncValue()).toBe("page/404.html");

  uo.give("http://domain.com/");

  expect(responseSrc.syncValue()).toBe("page/home.html");
});
