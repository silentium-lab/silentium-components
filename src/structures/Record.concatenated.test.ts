import { Late, Of, Shared, Transport } from "silentium";
import { Concatenated } from "../strings";
import { Record } from "./Record";
import { expect, test, vi } from "vitest";

test("Record.concatenated.test", () => {
  const $three = Of<string>("three");
  const $part = Late<string>("part");
  const r = Shared(
    Record({
      one: Of("one"),
      two: Of("two"),
      three: $three,
      nested: Concatenated([Of("one"), $part]),
    }),
  );
  const g = vi.fn();
  r.to(Transport(g));
  let counter = 0;
  r.to(
    Transport(() => {
      counter += 1;
    }),
  );

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  $part.use("changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
