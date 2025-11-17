import {
  Applied,
  Late,
  Of,
  Shared,
  Tap,
  TapMessage,
} from "silentium";
import { expect, test, vi } from "vitest";
import { Router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router first matching route responds, not subsequent matches", () => {
  const $url = Late<string>("http://domain.com/page/general");
  const $urlPath = Shared(Applied($url, drop("http://domain.com")));
  const g = vi.fn();
  $urlPath.pipe(Tap(g));

  const firstRouteMock = vi.fn(() => Of("first-route-response"));
  const secondRouteMock = vi.fn(() => Of("second-route-response"));

  const $router = Router(
    $urlPath,
    Of([
      {
        pattern: "^/page/.*", // This matches /page/anything
        message: TapMessage(firstRouteMock),
      },
      {
        pattern: "^/page/specific$", // This also matches /page/specific
        message: TapMessage(secondRouteMock),
      },
    ]),
    TapMessage(() => Of<string>("page/404.html")),
  );
  const g2 = vi.fn();
  $router.pipe(Tap(g2));

  // Initial URL should match first route
  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  expect(firstRouteMock).toHaveBeenCalledTimes(1);
  expect(secondRouteMock).toHaveBeenCalledTimes(0);

  // Change URL to /page/specific, which matches both patterns
  // But only the first matching route should respond
  $url.use("http://domain.com/page/specific");

  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  expect(firstRouteMock).toHaveBeenCalledTimes(2); // Called again
  expect(secondRouteMock).toHaveBeenCalledTimes(0); // Never called
});
