import { Late, Of, Shared } from "silentium";
import { concatenated } from "../strings";
import { recordOf } from "../structures/RecordOf";
import { expect, test, vi } from "vitest";

test("Record.concatenated.test", () => {
  const three = Of<string>("three");
  const concatPart = Late<string>("part");
  const r = Shared(
    recordOf({
      one: Of("one"),
      two: Of("two"),
      three,
      nested: concatenated([Of("one"), concatPart.event]),
    }),
  );
  const g = vi.fn();
  r.event(g);
  let counter = 0;
  r.event(() => {
    counter += 1;
  });

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  concatPart.use("changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
