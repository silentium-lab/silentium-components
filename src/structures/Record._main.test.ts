import { From, Late, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { RecordOf } from "./RecordOf";

test("Record._main.test", () => {
  const three = new Late<string>("three");
  const recordSrc = new RecordOf({
    one: new Of("one"),
    two: new Of(2),
    three,
  });
  const g = vi.fn();
  recordSrc.value(new From(g));

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three",
  });

  three.give("three-changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: 2,
    three: "three-changed",
  });
});
