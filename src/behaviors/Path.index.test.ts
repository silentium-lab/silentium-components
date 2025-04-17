import { sourceOf, SourceSync } from "silentium";
import { Path } from "./Path";
import { expect, test } from "vitest";

test("Path.index.test", () => {
  const record = sourceOf({
    name: "Peter",
    surname: "Parker",
    colors: ["blue", "red"],
    type: {
      name: "spider-man",
    },
  });
  const bestColor = new SourceSync(new Path(record, sourceOf("colors.0")));
  expect(bestColor.syncValue()).toBe("blue");
});
