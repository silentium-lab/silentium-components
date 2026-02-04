import { Late } from "silentium";
import { describe, expect, test } from "vitest";

import { Router } from "../navigation/Router";

describe("Router._conditions.test", () => {
  test("Base example", async () => {
    const $url = Late<string>("");
    const $router = Router(
      $url,
      [
        {
          condition: (u) => u === "",
          message: () => "home",
        },
        {
          condition: (u) => u === "cnt",
          message: () => "contacts",
        },
      ],
      () => "404",
    );
    expect(await $router).toBe("home");

    $url.use("cnt");
    expect(await $router).toBe("contacts");

    $url.use("not-existed");
    expect(await $router).toBe("404");

    $url.use("");
    expect(await $router).toBe("home");
  });
});
