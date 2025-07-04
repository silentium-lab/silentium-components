import { I, O, of, ownerSync, pool } from "silentium";
import { expect, test } from "vitest";
import { concatenated } from "../strings";
import { record } from "./Record";

test("Record.concatenated.test", () => {
  const three = I<string>("three");
  const [concatPart, cpo] = of<string>("part");
  const [r] = pool(
    record({
      one: I("one"),
      two: I("two"),
      three,
      nested: concatenated([I("one"), concatPart]),
    }),
  );
  const recordSrc = ownerSync(r);
  let counter = 0;
  r.value(
    O(() => {
      counter += 1;
    }),
  );

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  cpo.give("changed");

  expect(recordSrc.syncValue()).toStrictEqual({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
