import { Late, Of, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { RecordOf } from "./RecordOf";

test("Record._main.test", () => {
  const $three = Late<string>("three");
  const $record = RecordOf({
    one: Of("one"),
    two: Of(2),
    three: $three,
  });
  const g = vi.fn();
  $record.event(Transport(g));

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three",
  });

  $three.use("three-changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three-changed",
  });
});
