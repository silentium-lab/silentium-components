import { Applied, Connected, Late, Message, Of, Shared, Void } from "silentium";
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

test("Router destroys Connected messages when switching routes", () => {
  const $url = Late<string>("http://domain.com/");
  const $urlPath = Shared(Applied($url, drop("http://domain.com")));

  // Create mock destroyable messages for main routes and connected messages
  const firstRouteMainDestroy = vi.fn();
  const firstRouteConnectedDestroy = vi.fn();
  const secondRouteMainDestroy = vi.fn();
  const secondRouteConnectedDestroy = vi.fn();
  const defaultMainDestroy = vi.fn();
  const defaultConnectedDestroy = vi.fn();

  const $fcd = Message<string>((transport) => {
    transport("first-connected-response");
    return firstRouteConnectedDestroy;
  });
  const $firstRoute = () =>
    Connected(
      Message<string>((transport) => {
        transport("first-route-response");
        return firstRouteMainDestroy;
      }),
      $fcd,
    );

  const $scd = Message<string>((transport) => {
    transport("second-connected-response");
    return secondRouteConnectedDestroy;
  });
  const $secondRoute = () =>
    Connected(
      Message<string>((transport) => {
        transport("second-route-response");
        return secondRouteMainDestroy;
      }),
      $scd,
    );

  const $dcd = Message<string>((transport) => {
    transport("default-connected-response");
    return defaultConnectedDestroy;
  });
  const $default = () =>
    Connected(
      Message<string>((transport) => {
        transport("default-response");
        return defaultMainDestroy;
      }),
      $dcd,
    );

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

  $fcd.then(Void());
  $scd.then(Void());
  $dcd.then(Void());

  const g2 = vi.fn();
  $router.then(g2);

  // Initially no route matches, should use default
  expect(g2).toHaveBeenLastCalledWith("default-response");
  expect(defaultMainDestroy).not.toHaveBeenCalled();
  expect(defaultConnectedDestroy).not.toHaveBeenCalled();

  // Change to first route
  $url.use("http://domain.com/first");

  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  // Default Connected messages should be destroyed
  expect(defaultMainDestroy).toHaveBeenCalledTimes(1);
  expect(defaultConnectedDestroy).toHaveBeenCalledTimes(1);
  expect(firstRouteMainDestroy).not.toHaveBeenCalled();
  expect(firstRouteConnectedDestroy).not.toHaveBeenCalled();

  // Change to second route
  $url.use("http://domain.com/second");

  expect(g2).toHaveBeenLastCalledWith("second-route-response");
  // First route Connected messages should be destroyed
  expect(firstRouteMainDestroy).toHaveBeenCalledTimes(1);
  expect(firstRouteConnectedDestroy).toHaveBeenCalledTimes(1);
  expect(secondRouteMainDestroy).not.toHaveBeenCalled();
  expect(secondRouteConnectedDestroy).not.toHaveBeenCalled();

  // Change back to no match (default)
  $url.use("http://domain.com/nomatch");

  expect(g2).toHaveBeenLastCalledWith("default-response");
  // Second route Connected messages should be destroyed
  expect(secondRouteMainDestroy).toHaveBeenCalledTimes(1);
  expect(secondRouteConnectedDestroy).toHaveBeenCalledTimes(1);
  expect(defaultMainDestroy).toHaveBeenCalledTimes(1); // Still only once
  expect(defaultConnectedDestroy).toHaveBeenCalledTimes(1); // Still only once

  // Change back to first route
  $url.use("http://domain.com/first");

  expect(g2).toHaveBeenLastCalledWith("first-route-response");
  // Default destroyed again
  expect(defaultMainDestroy).toHaveBeenCalledTimes(2);
  expect(defaultConnectedDestroy).toHaveBeenCalledTimes(1);
  expect(firstRouteMainDestroy).toHaveBeenCalledTimes(1); // Still only once
  expect(firstRouteConnectedDestroy).toHaveBeenCalledTimes(1); // Still only once

  $router.destroy();
});
