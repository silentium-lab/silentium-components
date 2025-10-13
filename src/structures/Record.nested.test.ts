import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RecordOf } from "./RecordOf";

test("Record.nested.test", () => {
  const three = Of<string>("three");
  const recordSrc = RecordOf({
    one: Of("one"),
    two: Of("two"),
    three,
    nested: RecordOf({
      four: Of("four"),
      five: Of("five"),
    }),
  });
  const g = vi.fn();
  recordSrc(g);

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
