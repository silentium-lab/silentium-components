import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { recordOf } from "./RecordOf";

test("Record.nested.test", () => {
  const three = of<string>("three");
  const recordSrc = recordOf({
    one: of("one"),
    two: of("two"),
    three,
    nested: recordOf({
      four: of("four"),
      five: of("five"),
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
