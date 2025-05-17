import { patron, source, sourceOf, sourceSync } from "silentium";
import { expect, test } from "vitest";
import { record } from "./Record";
import { concatenated } from "../strings";

test("Record.concatenated.test", () => {
  const three = sourceOf<string>("three");
  const concatPart = sourceOf<string>("part");
  const recordSrc = sourceSync(
    record({
      one: "one",
      two: source("two"),
      three,
      nested: concatenated(["one", concatPart]),
    }),
  );
  let counter = 0;
  recordSrc.value(
    patron(() => {
      counter += 1;
    }),
  );

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  concatPart.give("changed");

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
