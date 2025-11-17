import {
  LateShared,
  Message,
  Of,
  Tap,
  TapMessage,
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
          message: TapMessage(() => Of<string>("home")),
        },
        {
          pattern: "/admin.*",
          message: TapMessage(() => {
            return Message((transport) => {
              // need to replace with detached component
              const localUrlSrc = Detached($url);

              const r = Router(
                localUrlSrc,
                Of([
                  {
                    pattern: "^/admin/articles$",
                    message: TapMessage(() => Of("articles list")),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    message: TapMessage(() => Of("articles create")),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    message: TapMessage(() => Of("articles update")),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    message: TapMessage(() => {
                      return Message((transport) => {
                        const localUrlSrc = Detached($url);

                        const r = Router(
                          localUrlSrc,
                          Of([
                            {
                              pattern: "^/admin/nested/list$",
                              message: TapMessage(() =>
                                Of("admin nested list"),
                              ),
                            },
                          ]),
                          TapMessage(() =>
                            Of<string>("admin nested not found"),
                          ),
                        );

                        r.pipe(transport);

                        return function AdminDestroy() {
                          r.destroy();
                        };
                      });
                    }),
                  },
                ]),
                TapMessage(() => Of<string>("admin not found")),
              );

              r.pipe(transport);

              return function AdminDestroy() {
                r.destroy();
              };
            });
          }),
        },
      ]),
      TapMessage(() => Of("not found")),
    );
    const d: string[] = [];
    $router.pipe(
      Tap((v) => {
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
