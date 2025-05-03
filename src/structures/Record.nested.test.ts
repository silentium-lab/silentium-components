import { source, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { record } from "./Record";

test("Record.nested.test", () => {
  const three = sourceOf<string>("three");
  const recordSrc = sourceSync(
    record({
      one: "one",
      two: source("two"),
      three,
      nested: record({
        four: "four",
        five: source("five"),
      }),
    }),
  );

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
    nested: {
      five: "five",
      four: "four",
    },
  });
});
