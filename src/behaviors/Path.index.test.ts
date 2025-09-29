import { of } from "silentium";
import { expect, test, vi } from "vitest";
import { path } from "./Path";

test("Path.index.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
    colors: ["blue", "red"],
    type: {
      name: "spider-man",
    },
  };
  const bestColor = path(of(record), of("colors.0"));
  const g = vi.fn();
  bestColor(g);
  expect(g).toHaveBeenLastCalledWith("blue");
});
