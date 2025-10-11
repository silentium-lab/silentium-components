import { late, of, shared } from "silentium";
import { concatenated } from "../strings";
import { recordOf } from "../structures/RecordOf";
import { expect, test, vi } from "vitest";

test("Record.concatenated.test", () => {
  const three = of<string>("three");
  const concatPart = late<string>("part");
  const r = shared(
    recordOf({
      one: of("one"),
      two: of("two"),
      three,
      nested: concatenated([of("one"), concatPart.event]),
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
