import { Of, Transport } from "silentium";
import { expect, test, vi } from "vitest";
import { Path } from "./Path";

test("Path._keyRaw.test", () => {
  const record = {
    name: "Peter",
    surname: "Parker",
  };
  const name = Path<string>(Of(record), "name");
  const g = vi.fn();
  name.to(Transport(g));
  expect(g).toHaveBeenLastCalledWith("Peter");
});
