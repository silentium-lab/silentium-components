import {
  Applied,
  Late,
  Of,
  Shared,
  Transport,
  TransportEvent,
} from "silentium";
import { Router } from "../navigation/Router";
import { expect, test, vi } from "vitest";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router._main.test", () => {
  const $url = Late<string>("http://domain.com/");
  const $urlPath = Shared(Applied($url, drop("http://domain.com")));
  const g = vi.fn();
  $urlPath.event(Transport(g));

  const $router = Router(
    $urlPath,
    Of([
      {
        pattern: "^/$",
        event: TransportEvent(() => Of("page/home.html")),
      },
      {
        pattern: "/some/contacts",
        event: TransportEvent(() => Of("page/contacts.html")),
      },
    ]),
    TransportEvent(() => Of<string>("page/404.html")),
  );
  const g2 = vi.fn();
  $router.event(Transport(g2));

  expect(g2).toHaveBeenLastCalledWith("page/home.html");

  $url.use("http://domain.com/some/contacts");

  expect(g).toHaveBeenLastCalledWith("/some/contacts");
  expect(g2).toHaveBeenLastCalledWith("page/contacts.html");

  $url.use("http://domain.com/some/unknown/");

  expect(g2).toHaveBeenLastCalledWith("page/404.html");

  $url.use("http://domain.com/");

  expect(g2).toHaveBeenLastCalledWith("page/home.html");
});
