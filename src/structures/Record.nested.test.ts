import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RecordOf } from "./RecordOf";

test("Record.nested.test", () => {
  const three = new Of<string>("three");
  const recordSrc = new RecordOf({
    one: new Of("one"),
    two: new Of("two"),
    three,
    nested: new RecordOf({
      four: new Of("four"),
      five: new Of("five"),
    }),
  });
  const g = vi.fn();
  recordSrc.value(new From(g));

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
