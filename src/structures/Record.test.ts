import { i, of } from "silentium";
import { expect, test, vi } from "vitest";
import { record } from "../structures/Record";

test("Record.test", () => {
  const [three, o] = of<string>("three");
  const recordSrc = record({
    one: i("one"),
    two: i(2),
    three,
  });
  const g = vi.fn();
  recordSrc(g);

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three",
  });

  o("three-changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three-changed",
  });
});
