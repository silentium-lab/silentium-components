import { applied, late, of, shared } from "silentium";
import { router } from "../navigation/Router";
import { expect, test, vi } from "vitest";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router._main.test", () => {
  const urlSrc = late<string>("http://domain.com/");
  const urlPathSrc = shared(applied(urlSrc.event, drop("http://domain.com")));
  const g = vi.fn();
  urlPathSrc.event(g);

  const routerSrc = router(
    urlPathSrc.event,
    of([
      {
        pattern: "^/$",
        template: () => of("page/home.html"),
      },
      {
        pattern: "/some/contacts",
        template: () => of("page/contacts.html"),
      },
    ]),
    () => of<string>("page/404.html"),
  );
  const g2 = vi.fn();
  routerSrc(g2);

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  urlSrc.use("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  urlSrc.use("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  urlSrc.use("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
