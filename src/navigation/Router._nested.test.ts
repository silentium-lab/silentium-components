import { Event, LateShared, Of, Transport, TransportEvent } from "silentium";
import { describe, expect, test } from "vitest";
import { Detached } from "../behaviors/Detached";
import { Router } from "../navigation/Router";

describe("Router._nested.test", () => {
  test("Вложенные роуты", () => {
    const $url = LateShared("/");
    const $router = Router(
      $url,
      Of([
        {
          pattern: "^/$",
          event: TransportEvent(() => Of<string>("home")),
        },
        {
          pattern: "/admin.*",
          event: TransportEvent(() => {
            return Event((transport) => {
              // need to replace with detached component
              const localUrlSrc = Detached($url);

              const r = Router(
                localUrlSrc,
                Of([
                  {
                    pattern: "^/admin/articles$",
                    event: TransportEvent(() => Of("articles list")),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    event: TransportEvent(() => Of("articles create")),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    event: TransportEvent(() => Of("articles update")),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    event: TransportEvent(() => {
                      return Event((transport) => {
                        const localUrlSrc = Detached($url);

                        const r = Router(
                          localUrlSrc,
                          Of([
                            {
                              pattern: "^/admin/nested/list$",
                              event: TransportEvent(() =>
                                Of("admin nested list"),
                              ),
                            },
                          ]),
                          TransportEvent(() =>
                            Of<string>("admin nested not found"),
                          ),
                        );

                        r.event(transport);

                        return function AdminDestroy() {
                          r.destroy();
                        };
                      });
                    }),
                  },
                ]),
                TransportEvent(() => Of<string>("admin not found")),
              );

              r.event(transport);

              return function AdminDestroy() {
                r.destroy();
              };
            });
          }),
        },
      ]),
      TransportEvent(() => Of("not found")),
    );
    const d: string[] = [];
    $router.event(
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
