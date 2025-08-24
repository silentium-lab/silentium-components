import { From, Late, Of, Shared } from "silentium";
import { expect, test, vi } from "vitest";
import { Concatenated } from "../strings";
import { RecordOf } from "./RecordOf";

test("Record.concatenated.test", () => {
  const three = new Of<string>("three");
  const concatPart = new Late<string>("part");
  const r = new Shared(
    new RecordOf({
      one: new Of("one"),
      two: new Of("two"),
      three,
      nested: new Concatenated([new Of("one"), concatPart]),
    }),
  );
  const g = vi.fn();
  r.value(new From(g));
  let counter = 0;
  r.value(
    new From(() => {
      counter += 1;
    }),
  );

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  concatPart.owner().give("changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
