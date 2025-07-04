import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { path } from "./Path";

test("Path.index.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    colors: ["blue", "red"],
    type: {
      name: "spider-man",
    },
  };
  const bestColor = ownerSync(path(I(record), I("colors.0")));
  expect(bestColor.syncValue()).toBe("blue");
});
