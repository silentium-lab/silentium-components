import { Applied, Late, Message, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";

import { Router } from "../navigation/Router";

const drop = (dropPart: string) => (value: string) => {
  return value.replace(dropPart, "");
};

test("Router destroys previous route messages when switching routes", () => {
  const $url = Late<string>("http://domain.com/");
  const $urlPath = Shared(Applied($url, drop("http://domain.com")));
  const g = vi.fn();
  $urlPath.then(g);

  // Create mock destroyable messages for routes
  const firstRouteDestroy = vi.fn();
  const secondRouteDestroy = vi.fn();
  const defaultDestroy = vi.fn();

  const $firstRoute = () =>
    Message<string>((transport) => {
      transport("first-route-response");
      return firstRouteDestroy;
    });

  const $secondRoute = () =>
    Message<string>((transport) => {
      transport("second-route-response");
      return secondRouteDestroy;
    });

  const $default = () =>
    Message<string>((transport) => {
      transport("default-response");
      return defaultDestroy;
    });

  const $router = Router(
    $urlPath,
    Of([
      {
        pattern: "^/first$",
        message: $firstRoute,
      },
      {
        pattern: "^/second$",
        message: $secondRoute,
      },
    ]),
    $default,
  );

  const g2 = vi.fn();
  $router.then(g2);

  // Initially no route matches, should use default
  expect(g2).toHaveBeenLastCalledWith("default-response");
  expect(defaultDestroy).not.toHaveBeenCalled();

  // Change to first route
  $url.use("http://domain.com/first");

  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  expect(defaultDestroy).toHaveBeenCalledTimes(1); // Default should be destroyed
  expect(firstRouteDestroy).not.toHaveBeenCalled();

  // Change to second route
  $url.use("http://domain.com/second");

  expect(g2).toHaveBeenLastCalledWith("second-route-response");
  expect(firstRouteDestroy).toHaveBeenCalledTimes(1); // First route should be destroyed
  expect(secondRouteDestroy).not.toHaveBeenCalled();

  // Change back to no match (default)
  $url.use("http://domain.com/nomatch");

  expect(g2).toHaveBeenLastCalledWith("default-response");
  expect(secondRouteDestroy).toHaveBeenCalledTimes(1); // Second route should be destroyed
  expect(defaultDestroy).toHaveBeenCalledTimes(1); // Still only once, as it was destroyed before

  // Change back to first route
  $url.use("http://domain.com/first");

  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  expect(defaultDestroy).toHaveBeenCalledTimes(2); // Default destroyed again
  expect(firstRouteDestroy).toHaveBeenCalledTimes(1); // Still only once

  $router.destroy();
});
