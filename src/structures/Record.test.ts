import { I, of, ownerSync } from "silentium";
import { expect, test } from "vitest";
import { record } from "../structures/Record";

test("Record.test", () => {
  const [three, o] = of<string>("three");
  const recordSrc = ownerSync(
    record({
      one: I("one"),
      two: I("two"),
      three,
    }),
  );

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
  });

  o.give("three-changed");

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three-changed",
  });
});
