import { Applied, Late, Of } from "silentium";
import { describe, expect, test } from "vitest";

import { Transformed } from "../behaviors/Transformed";
import { Record } from "../structures";

describe("Transformed.test", () => {
  test("Field modification", async () => {
    const src = Late(4);
    const rec = Transformed(
      Record({
        f: src,
      }),
      {
        f: (v) => Applied(v, (x) => x.f * x.f),
      },
    );
    expect(await rec).toStrictEqual({
      f: 16,
    });

    src.use(5);
    expect(await rec).toStrictEqual({
      f: 25,
    });
  });

  test("New fields", async () => {
    const src = Transformed(
      Of({
        count: 4,
      }),
      {
        doubleCount: (v) => Of(v.count * 2),
      },
    );

    expect(await src).toStrictEqual({
      count: 4,
      doubleCount: 8,
    });
  });
});
