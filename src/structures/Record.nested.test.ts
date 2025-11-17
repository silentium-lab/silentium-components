import { Of, Tap } from "silentium";
import { expect, test, vi } from "vitest";
import { Record } from "./Record";

test("Record.nested.test", () => {
  const $three = Of<string>("three");
  const $record = Record({
    one: Of("one"),
    two: Of("two"),
    three: $three,
    nested: Record({
      four: Of("four"),
      five: Of("five"),
    }),
  });
  const g = vi.fn();
  $record.pipe(Tap(g));

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: {
      five: "five",
      four: "four",
    },
  });
});
