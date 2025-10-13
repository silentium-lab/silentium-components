import { Of } from "silentium";
import { expect, test, vi } from "vitest";
import { recordOf } from "./RecordOf";

test("Record.nested.test", () => {
  const three = Of<string>("three");
  const recordSrc = recordOf({
    one: Of("one"),
    two: Of("two"),
    three,
    nested: recordOf({
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
