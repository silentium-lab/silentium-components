import { describe, expect, test } from "vitest";

import { Getter } from "./Getter";

describe("Getter.test", () => {
  test("read method", async () => {
    const res = Getter(
      {
        value() {
          return 1;
        },
      },
      "value",
    );
    expect(await res).toBe(1);
  });
});
