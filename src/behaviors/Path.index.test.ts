import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path.index.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    colors: ["blue", "red"],
    type: {
      name: "spider-man",
    },
  };
  const bestColor = new Path(new Of(record), new Of("colors.0"));
  const g = vi.fn();
  bestColor.value(new From(g));
  expect(g).toHaveBeenLastCalledWith("blue");
});
