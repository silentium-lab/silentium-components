import { Of } from "silentium";
import { Concatenated } from "../strings/Concatenated";
import { expect, test, vi } from "vitest";

test("Concatenated.test", () => {
  const concatenatedSrc = Concatenated(
    [Of("one"), Of("two"), Of("three")],
    Of("-"),
  );
  const g = vi.fn();
  concatenatedSrc(g);

  expect(g).toHaveBeenLastCalledWith("one-two-three");
});
