import { Of } from "silentium";
import { describe, expect, test } from "vitest";

import { TransformedList } from "../behaviors/TransformedList";

describe("TransformedList.test", () => {
  test("Модификация поля в списке объектов", async () => {
    const r = TransformedList(
      Of([
        {
          name: "hello",
        },
        {
          name: "buy",
        },
      ]),
      {
        name: (v) => Of(v.name + " changed"),
      },
    );

    expect(await r).toStrictEqual([
      {
        name: "hello changed",
      },
      {
        name: "buy changed",
      },
    ]);
  });

  test("Создание поля в списке объектов", async () => {
    const r = TransformedList(
      Of([
        {
          name: "hello",
        },
        {
          name: "buy",
        },
      ]),
      {
        common: (i) => Of(i.name + " changed"),
      },
    );

    expect(await r).toStrictEqual([
      {
        common: "hello changed",
        name: "hello",
      },
      {
        common: "buy changed",
        name: "buy",
      },
    ]);
  });
});
