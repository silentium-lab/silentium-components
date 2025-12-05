import { Late, Message, Of } from "silentium";
import { describe, expect, test } from "vitest";

import { Detached } from "../behaviors/Detached";
import { Router } from "../navigation/Router";

describe("Router._nested.test", () => {
  test("Nested routes", () => {
    const $url = Late("/");
    const $router = Router(
      $url,
      Of([
        {
          pattern: "^/$",
          message: () => Of<string>("home"),
        },
        {
          pattern: "/admin.*",
          message: () => {
            return Message((transport) => {
              // need to replace with detached component
              const localUrlSrc = Detached($url);

              const r = Router(
                localUrlSrc,
                Of([
                  {
                    pattern: "^/admin/articles$",
                    message: () => Of("articles list"),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    message: () => Of("articles create"),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    message: () => Of("articles update"),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    message: () => {
                      return Message((transport) => {
                        const localUrlSrc = Detached($url);

                        const r = Router(
                          localUrlSrc,
                          Of([
                            {
                              pattern: "^/admin/nested/list$",
                              message: () => Of("admin nested list"),
                            },
                          ]),
                          () => Of<string>("admin nested not found"),
                        );

                        r.then(transport);

                        return function AdminDestroy() {
                          r.destroy();
                        };
                      });
                    },
                  },
                ]),
                () => Of<string>("admin not found"),
              );

              r.then(transport);

              return function AdminDestroy() {
                r.destroy();
              };
            });
          },
        },
      ]),
      () => Of("not found"),
    );
    const d: string[] = [];
    $router.then((v) => {
      d.push(v);
    });
    const pd = () => d.join("\n");

    $url.use("/admin/articles");
    $url.use("/admin/nested/list");
    $url.use("/admin/articles/create");
    $url.use("/admin/articles/update");

    expect(pd()).toBe(`home
articles list
admin nested list
articles create
articles update`);
  });
});
