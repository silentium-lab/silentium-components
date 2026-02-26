import { Late, Message, Value, Void } from "silentium";
import { describe, expect, test } from "vitest";

import { Switch } from "./Switch";

describe("Switch.test", () => {
  test("Switch.regular", () => {
    const $trigger = Late("a");
    const src = Switch($trigger, [
      [
        "a",
        Message((resolve) => {
          resolve("Option A");
        }),
      ],
      [
        "b",
        Message((resolve) => {
          resolve("Option B");
        }),
      ],
      [
        "c",
        Message((resolve) => {
          resolve("Option C");
        }),
      ],
    ]);
    const data: string[] = [];
    src.then((v) => {
      data.push(v as string);
    });

    expect(data).toStrictEqual(["Option A"]);

    $trigger.use("b");
    expect(data).toStrictEqual(["Option A", "Option B"]);

    $trigger.use("c");
    expect(data).toStrictEqual(["Option A", "Option B", "Option C"]);

    $trigger.use("d");
    expect(data).toStrictEqual(["Option A", "Option B", "Option C"]);

    $trigger.use("a");
    expect(data).toStrictEqual([
      "Option A",
      "Option B",
      "Option C",
      "Option A",
    ]);
  });

  test("Switch.noMatch", () => {
    const $trigger = Late("x");
    const src = Switch($trigger, [
      [
        "a",
        Message((resolve) => {
          resolve("Option A");
        }),
      ],
      [
        "b",
        Message((resolve) => {
          resolve("Option B");
        }),
      ],
    ]);
    const data: string[] = [];
    src.then((v) => {
      data.push(v as string);
    });

    expect(data).toStrictEqual([]);
  });

  test("Switch.errorHandling", () => {
    const $trigger = Late("a");
    const src = Switch($trigger, [
      [
        "a",
        Message((_, reject) => {
          reject(new Error("Test error"));
        }),
      ],
      [
        "b",
        Message((resolve) => {
          resolve("Option B");
        }),
      ],
    ]);
    const data: string[] = [];
    src.catch((err: unknown) => {
      if (err instanceof Error) {
        data.push(err.message);
      }
    });
    src.then(Void());

    expect(data).toStrictEqual(["Test error"]);
  });

  test("Switch.cleanup", () => {
    const $trigger = Late("a");
    const src = Switch($trigger, [
      [
        "a",
        Message((resolve) => {
          resolve("Option A");
        }),
      ],
      [
        "b",
        Message((resolve) => {
          resolve("Option B");
        }),
      ],
    ]);
    const data: string[] = [];
    src.then((v) => {
      data.push(v as string);
    });
    src.destroy();

    expect(data).toStrictEqual(["Option A"]);

    $trigger.use("b");
    expect(data).toStrictEqual(["Option A"]);
  });

  test("Switch.multipleVariants", () => {
    const $trigger = Late("a");
    const src = Value(
      Switch($trigger, [
        [
          "a",
          Message((resolve) => {
            resolve("Option A");
          }),
        ],
        [
          ["b", "c"],
          Message((resolve) => {
            resolve("B or C");
          }),
        ],
      ]),
    );
    expect(src.value).toBe("Option A");

    $trigger.use("c");
    expect(src.value).toBe("B or C");

    $trigger.use("b");
    expect(src.value).toBe("B or C");

    $trigger.use("a");
    expect(src.value).toBe("Option A");
  });
});
