import { i } from "silentium";
import { expect, test, vi } from "vitest";
import { record } from "./Record";

test("Record.nested.test", () => {
  const three = i<string>("three");
  const recordSrc = record({
    one: i("one"),
    two: i("two"),
    three,
    nested: record({
      four: i("four"),
      five: i("five"),
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
