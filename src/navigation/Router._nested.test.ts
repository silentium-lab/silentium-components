import {
  LateShared,
  Message,
  Of,
  Transport,
  TransportMessage,
} from "silentium";
import { describe, expect, test } from "vitest";
import { Detached } from "../behaviors/Detached";
import { Router } from "../navigation/Router";

describe("Router._nested.test", () => {
  test("Nested routes", () => {
    const $url = LateShared("/");
    const $router = Router(
      $url,
      Of([
        {
          pattern: "^/$",
          message: TransportMessage(() => Of<string>("home")),
        },
        {
          pattern: "/admin.*",
          message: TransportMessage(() => {
            return Message((transport) => {
              // need to replace with detached component
              const localUrlSrc = Detached($url);

              const r = Router(
                localUrlSrc,
                Of([
                  {
                    pattern: "^/admin/articles$",
                    message: TransportMessage(() => Of("articles list")),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    message: TransportMessage(() => Of("articles create")),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    message: TransportMessage(() => Of("articles update")),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    message: TransportMessage(() => {
                      return Message((transport) => {
                        const localUrlSrc = Detached($url);

                        const r = Router(
                          localUrlSrc,
                          Of([
                            {
                              pattern: "^/admin/nested/list$",
                              message: TransportMessage(() =>
                                Of("admin nested list"),
                              ),
                            },
                          ]),
                          TransportMessage(() =>
                            Of<string>("admin nested not found"),
                          ),
                        );

                        r.to(transport);

                        return function AdminDestroy() {
                          r.destroy();
                        };
                      });
                    }),
                  },
                ]),
                TransportMessage(() => Of<string>("admin not found")),
              );

              r.to(transport);

              return function AdminDestroy() {
                r.destroy();
              };
            });
          }),
        },
      ]),
      TransportMessage(() => Of("not found")),
    );
    const d: string[] = [];
    $router.to(
      Transport((v) => {
        d.push(v);
      }),
    );
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
