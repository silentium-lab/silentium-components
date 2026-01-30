import { Applied, Late, Of, Shared } from "silentium";
import { describe, expect, test, vi } from "vitest";

import { Router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

describe("Router._main.test", () => {
  test("Base example", () => {
    const $url = Late<string>("http://domain.com/");
    const $urlPath = Shared(Applied($url, drop("http://domain.com")));
    const g = vi.fn();
    $urlPath.then(g);

    const $router = Router(
      $urlPath,
      Of([
        {
          pattern: "^/$",
          message: () => Of("page/home.html"),
        },
        {
          pattern: "/some/contacts",
          message: () => Of("page/contacts.html"),
        },
      ]),
      () => Of<string>("page/404.html"),
    );
    const g2 = vi.fn();
    $router.then(g2);

    expect(g2).toHaveBeenLastCalledWith("page/home.html");

    $url.use("http://domain.com/some/contacts");

    expect(g).toHaveBeenLastCalledWith("/some/contacts");
    expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

    $url.use("http://domain.com/some/unknown/");

    expect(g2).toHaveBeenLastCalledWith("page/404.html");

    $url.use("http://domain.com/");

    expect(g2).toHaveBeenLastCalledWith("page/home.html");
  });

  test("With raw value", async () => {
    const $path = Late("/some/contacts");
    const $router = Router(
      $path,
      Of([
        {
          pattern: "^/$",
          message: () => "page/home.html",
        },
        {
          pattern: "/some/contacts",
          message: () => "page/contacts.html",
        },
      ]),
      () => "page/404.html",
    );

    expect(await $router).toBe("page/contacts.html");

    $path.use("/nourl");

    expect(await $router).toBe("page/404.html");

    $path.use("/");

    expect(await $router).toBe("page/home.html");
  });
});
