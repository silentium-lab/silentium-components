import { source, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { record } from "../structures/Record";

test("Record.test", () => {
  const three = sourceOf<string>("three");
  const recordSrc = sourceSync(
    record({
      one: "one",
      two: source("two"),
      three,
    }),
  );

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
  });

  three.give("three-changed");

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three-changed",
  });
});
