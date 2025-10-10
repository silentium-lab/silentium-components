import { lateShared, of } from "silentium";
import { describe, expect, test } from "vitest";
import { detached } from "../behaviors/Detached";
import { router } from "../navigation/Router";

describe("Router._nested.test", () => {
  test("Вложенные роуты", () => {
    const urlSrc = lateShared("/");
    const routerSrc = router(
      urlSrc.value,
      of([
        {
          pattern: "^/$",
          template: () => of<string>("home"),
        },
        {
          pattern: "/admin.*",
          template: () => {
            return (user) => {
              // need to replace with detached component
              const localUrlSrc = detached(urlSrc.value);

              const r = router(
                localUrlSrc,
                of([
                  {
                    pattern: "^/admin/articles$",
                    template: () => of("articles list"),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    template: () => of("articles create"),
                  },
                  {
                    pattern: "^/admin/articles/update$",
                    template: () => of("articles update"),
                  },
                  {
                    pattern: "^/admin/nested/.*$",
                    template: () => {
                      return (user) => {
                        const localUrlSrc = detached(urlSrc.value);

                        const r = router(
                          localUrlSrc,
                          of([
                            {
                              pattern: "^/admin/nested/list$",
                              template: () => of("admin nested list"),
                            },
                          ]),
                          () => of<string>("admin nested not found"),
                        );
                        const rDestructor = r(user);

                        return function AdminDestroy() {
                          rDestructor?.();
                        };
                      };
                    },
                  },
                ]),
                () => of<string>("admin not found"),
              );
              const rDestructor = r(user);

              return function AdminDestroy() {
                rDestructor?.();
              };
            };
          },
        },
      ]),
      () => of("not found"),
    );
    const d: string[] = [];
    routerSrc((v) => {
      d.push(v);
    });
    const pd = () => d.join("\n");

    urlSrc.give("/admin/articles");
    urlSrc.give("/admin/nested/list");
    urlSrc.give("/admin/articles/create");
    urlSrc.give("/admin/articles/update");

    expect(pd()).toBe(`home
articles list
admin nested list
articles create
articles update`);
  });
});
