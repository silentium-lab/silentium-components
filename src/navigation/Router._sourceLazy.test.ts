import { lazy, source, sourceLazy, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { router } from "../navigation/Router";

test("Router._sourceLazy.test", () => {
  const sources: any = {
    one: {
      called: 0,
      src: lazy((arg) => {
        sources.one.called += 1;
        return arg;
      }),
    },
    two: {
      called: 0,
      src: lazy((arg) => {
        sources.two.called += 2;
        return arg;
      }),
    },
    three: {
      called: 0,
      src: lazy((arg) => {
        sources.three.called += 3;
        return arg;
      }),
    },
  };

  const actionSrc = sourceOf<string>("1");
  const template = sourceSync(
    router(
      actionSrc,
      [
        {
          pattern: "1",
          template: sourceLazy(sources.one.src, [111]),
        },
        {
          pattern: "2",
          template: sourceLazy(sources.two.src, [222]),
        },
        {
          pattern: "3",
          template: sourceLazy(sources.three.src, [333]),
        },
      ],
      source("page/404.html"),
    ),
  );

  expect(template.syncValue()).toBe(111);
  // FIXME wrong test!!
  expect(Object.values(sources).map((v: any) => v.called)).toStrictEqual([
    1, 0, 0,
  ]);

  actionSrc.give("2");

  // expect(template.syncValue()).toBe(222);
});
