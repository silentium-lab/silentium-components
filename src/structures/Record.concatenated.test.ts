import { i, of, shared } from "silentium";
import { expect, test, vi } from "vitest";
import { concatenated } from "../strings";
import { record } from "./Record";

test("Record.concatenated.test", () => {
  const three = i<string>("three");
  const [concatPart, cpo] = of<string>("part");
  const [r] = shared(
    record({
      one: i("one"),
      two: i("two"),
      three,
      nested: concatenated([i("one"), concatPart]),
    }),
  );
  const g = vi.fn();
  r(g);
  let counter = 0;
  r(() => {
    counter += 1;
  });

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onepart",
  });

  cpo("changed");

  expect(g).toHaveBeenLastCalledWith({
    one: "one",
    two: "two",
    three: "three",
    nested: "onechanged",
  });
  expect(counter).toBe(2);
});
