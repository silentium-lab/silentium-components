import { I, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { record } from "./Record";

test("Record.nested.test", () => {
  const three = I<string>("three");
  const recordSrc = ownerSync(
    record({
      one: I("one"),
      two: I("two"),
      three,
      nested: record({
        four: I("four"),
        five: I("five"),
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
