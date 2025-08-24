import { From, Of } from "silentium";
import { expect, test, vi } from "vitest";
import { Concatenated } from "../strings/Concatenated";

test("Concatenated.test", () => {
  const concatenatedSrc = new Concatenated(
    [new Of("one"), new Of("two"), new Of("three")],
    new Of("-"),
  );
  const g = vi.fn();
  concatenatedSrc.value(new From(g));

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
