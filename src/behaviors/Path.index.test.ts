import { Of, Transport } from "silentium";
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
  const bestColor = Path(Of(record), Of("colors.0"));
  const g = vi.fn();
  bestColor.event(Transport(g));
  expect(g).toHaveBeenLastCalledWith("blue");
});
