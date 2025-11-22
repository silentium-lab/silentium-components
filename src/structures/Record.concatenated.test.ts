import { Late, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";

import { Concatenated } from "../strings";
import { Record } from "./Record";

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
  r.then(g);
  let counter = 0;
  r.then(() => {
    counter += 1;
  });

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
