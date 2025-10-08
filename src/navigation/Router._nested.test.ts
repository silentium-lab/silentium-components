import { lateShared, of, destructor, local } from "silentium";
import { router } from "../navigation/Router";
import { describe, expect, test } from "vitest";

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
              const localUrlSrc = destructor(local(urlSrc.value));

              const r = router(
                localUrlSrc.value,
                of([
                  {
                    pattern: "^/admin/articles$",
                    name: "list",
                    template: () => of("articles list"),
                  },
                  {
                    pattern: "^/admin/articles/create$",
                    name: "create",
                    template: () => of("articles create"),
                  },
                ]),
                () => of("admin not found"),
              );
              const rDestructor = r(user);

              return function AdminDestroy() {
                localUrlSrc.destroy();
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

    urlSrc.give("/");
    urlSrc.give("/admin/articles");
    urlSrc.give("/admin/articles/create");

    expect(pd()).toBe("");
  });
});
