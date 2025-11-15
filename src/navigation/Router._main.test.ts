import {
  Applied,
  Late,
  Of,
  Shared,
  Transport,
  TransportMessage,
} from "silentium";
import { expect, test, vi } from "vitest";
import { Router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router._main.test", () => {
  const $url = Late<string>("http://domain.com/");
  const $urlPath = Shared(Applied($url, drop("http://domain.com")));
  const g = vi.fn();
  $urlPath.to(Transport(g));

  const $router = Router(
    $urlPath,
    Of([
      {
        pattern: "^/$",
        message: TransportMessage(() => Of("page/home.html")),
      },
      {
        pattern: "/some/contacts",
        message: TransportMessage(() => Of("page/contacts.html")),
      },
    ]),
    TransportMessage(() => Of<string>("page/404.html")),
  );
  const g2 = vi.fn();
  $router.to(Transport(g2));

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  $url.use("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  $url.use("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  $url.use("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
