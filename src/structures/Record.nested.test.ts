import { Of, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { RecordOf } from "./RecordOf";

test("Record.nested.test", () => {
  const $three = Of<string>("three");
  const $record = RecordOf({
    one: Of("one"),
    two: Of("two"),
    three: $three,
    nested: RecordOf({
      four: Of("four"),
      five: Of("five"),
    }),
  });
  const g = vi.fn();
  $record.event(Transport(g));

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
