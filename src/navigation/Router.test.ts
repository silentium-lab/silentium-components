import { applied, i, of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router.test", () => {
  const [urlSrc, uo] = of<string>("http://domain.com/");
  const [urlPathSrc] = shared(applied(urlSrc, drop("http://domain.com")));
  const g = vi.fn();
  urlPathSrc(g);

  const routerSrc = router(
    urlPathSrc,
    i([
      {
        pattern: "^/$",
        template: i("page/home.html"),
      },
      {
        pattern: "/some/contacts",
        template: "page/contacts.html",
      },
    ]),
    i("page/404.html"),
  );
  const g2 = vi.fn();
  routerSrc(g2);

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  uo("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  uo("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  uo("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
