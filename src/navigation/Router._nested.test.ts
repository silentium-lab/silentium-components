import { LateShared, Of } from "silentium";
import { describe, expect, test } from "vitest";
import { Detached } from "../behaviors/Detached";
import { Router } from "../navigation/Router";

describe("Router._nested.test", () => {
  test("Вложенные роуты", () => {
    const urlSrc = LateShared("/");
    const routerSrc = Router(
      urlSrc.event,
      Of([
        {
          pattern: "^/$",
          template: () => Of<string>("home"),
        },
        {
          pattern: "/admin.*",
          template: () => {
            return (user) => {
              // need to replace with detached component
              const localUrlSrc = Detached(urlSrc.event);

              const r = Router(
                localUrlSrc,
                Of([
                  {
                    pattern: "^/admin/articles$",
                    template: () => Of("articles list"),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    template: () => Of("articles create"),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    template: () => Of("articles update"),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    template: () => {
                      return (user) => {
                        const localUrlSrc = Detached(urlSrc.event);

                        const r = Router(
                          localUrlSrc,
                          Of([
                            {
                              pattern: "^/admin/nested/list$",
                              template: () => Of("admin nested list"),
                            },
                          ]),
                          () => Of<string>("admin nested not found"),
                        );
                        const rDestructor = r(user);

                        return function AdminDestroy() {
                          rDestructor?.();
                        };
                      };
                    },
                  },
                ]),
                () => Of<string>("admin not found"),
              );
              const rDestructor = r(user);

              return function AdminDestroy() {
                rDestructor?.();
              };
            };
          },
        },
      ]),
      () => Of("not found"),
    );
    const d: string[] = [];
    routerSrc((v) => {
      d.push(v);
    });
    const pd = () => d.join("\n");

    urlSrc.use("/admin/articles");
    urlSrc.use("/admin/nested/list");
    urlSrc.use("/admin/articles/create");
    urlSrc.use("/admin/articles/update");

    expect(pd()).toBe(`home
articles list
admin nested list
articles create
articles update`);
  });
});
